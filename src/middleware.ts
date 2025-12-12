import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Domínios da aplicação principal (não são sites de clientes)
const APP_DOMAINS = [
    "localhost",
    "127.0.0.1",
    "psibuilder.com.br",
    "www.psibuilder.com.br",
    "psibuilder.vercel.app",
];

// Subdomínios reservados (não são sites de clientes)
const RESERVED_SUBDOMAINS = [
    "www",
    "app",
    "api",
    "admin",
    "dashboard",
    "mail",
    "smtp",
    "ftp",
    "cdn",
    "assets",
    "static",
];

/**
 * Extrai informações do host para determinar o tipo de acesso
 */
function parseHost(host: string): {
    isAppDomain: boolean;
    subdomain: string | null;
    customDomain: string | null;
} {
    // Remove porta se existir
    const hostname = host.split(":")[0];

    // Verificar se é domínio da aplicação principal
    if (APP_DOMAINS.includes(hostname)) {
        return { isAppDomain: true, subdomain: null, customDomain: null };
    }

    // Verificar se é um subdomínio do PsiBuilder
    const psibuilderDomains = ["psibuilder.com.br", "psibuilder.vercel.app"];

    for (const domain of psibuilderDomains) {
        if (hostname.endsWith(`.${domain}`)) {
            const subdomain = hostname.replace(`.${domain}`, "");

            // Verificar se é subdomínio reservado
            if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
                return { isAppDomain: true, subdomain: null, customDomain: null };
            }

            return { isAppDomain: false, subdomain, customDomain: null };
        }
    }

    // Tratamento especial para localhost com subdomínio
    if (hostname.endsWith(".localhost")) {
        const subdomain = hostname.replace(".localhost", "");
        if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
            return { isAppDomain: true, subdomain: null, customDomain: null };
        }
        return { isAppDomain: false, subdomain, customDomain: null };
    }

    // Se não for subdomínio do PsiBuilder, é domínio customizado
    return { isAppDomain: false, subdomain: null, customDomain: hostname };
}

export async function middleware(request: NextRequest) {
    const host = request.headers.get("host") || "localhost";
    const { isAppDomain, subdomain, customDomain } = parseHost(host);
    const { pathname } = request.nextUrl;

    // Se for domínio da app principal, processar normalmente
    if (isAppDomain) {
        // Atualizar sessão Supabase para rotas protegidas
        return await updateSession(request);
    }

    // Se for subdomínio ou domínio customizado, redirecionar para rota de site
    const siteIdentifier = subdomain || customDomain;

    if (siteIdentifier) {
        // Reescrever URL para a rota de sites públicos
        // /site/[subdomain]/... 
        const url = request.nextUrl.clone();

        // Se já está na rota /site, não reescrever novamente
        if (pathname.startsWith("/site/")) {
            return NextResponse.next();
        }

        // Reescrever para a rota dinâmica de sites
        url.pathname = `/site/${siteIdentifier}${pathname}`;

        // Adicionar headers para identificar o site
        const response = NextResponse.rewrite(url);
        response.headers.set("x-site-subdomain", subdomain || "");
        response.headers.set("x-site-custom-domain", customDomain || "");
        response.headers.set("x-site-identifier", siteIdentifier);

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Arquivos estáticos (imagens, fontes, etc)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
    ],
};
