// src/app/api/site/domain/route.ts
// API para gerenciamento de domínio customizado
// Integra Supabase + Vercel API automaticamente

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addDomainToVercel, removeDomainFromVercel, getDomainConfig } from "@/lib/vercel";

/**
 * POST - Salvar/atualizar domínio customizado
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { siteId, domain } = await request.json();

        if (!siteId) {
            return NextResponse.json(
                { error: "Site ID obrigatório" },
                { status: 400 }
            );
        }

        // Verificar se usuário é dono do site
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

        const { data: site } = await supabase
            .from("sites")
            .select("id, custom_domain, profile_id")
            .eq("id", siteId)
            .single();

        if (!site || site.profile_id !== profile?.id) {
            return NextResponse.json(
                { error: "Site não encontrado ou sem permissão" },
                { status: 403 }
            );
        }

        // Verificar se é plano Pro
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("plan, status")
            .eq("user_id", user.id)
            .single();

        const isPro = subscription?.plan === "pro" && subscription?.status === "active";
        if (!isPro) {
            return NextResponse.json(
                { error: "Domínio customizado disponível apenas para plano Pro" },
                { status: 403 }
            );
        }

        // Limpar domínio
        const cleanDomain = domain
            ? domain
                .toLowerCase()
                .trim()
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/\/$/, "")
            : null;

        // Se tinha domínio antigo diferente, remover da Vercel
        if (site.custom_domain && site.custom_domain !== cleanDomain) {
            await removeDomainFromVercel(site.custom_domain);
        }

        // Se tem novo domínio, adicionar na Vercel
        if (cleanDomain) {
            const vercelResult = await addDomainToVercel(cleanDomain);

            if (!vercelResult.success) {
                return NextResponse.json(
                    { error: vercelResult.error || "Erro ao configurar domínio" },
                    { status: 400 }
                );
            }
        }

        // Salvar no banco
        const { error: dbError } = await supabase
            .from("sites")
            .update({ custom_domain: cleanDomain })
            .eq("id", siteId);

        if (dbError) {
            // Rollback: remover da Vercel se falhou no banco
            if (cleanDomain) {
                await removeDomainFromVercel(cleanDomain);
            }
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            domain: cleanDomain,
            message: cleanDomain
                ? "Domínio salvo! Configure o DNS conforme as instruções."
                : "Domínio removido com sucesso.",
        });

    } catch (error) {
        console.error("Erro ao salvar domínio:", error);
        return NextResponse.json(
            { error: "Erro interno ao salvar domínio" },
            { status: 500 }
        );
    }
}

/**
 * GET - Verificar status do domínio (usa Vercel API se disponível)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get("domain");

        if (!domain) {
            return NextResponse.json(
                { error: "Domínio obrigatório" },
                { status: 400 }
            );
        }

        // Primeiro tenta verificar via Vercel API (mais preciso)
        const vercelConfig = await getDomainConfig(domain);

        if (vercelConfig.isConfigured !== undefined) {
            return NextResponse.json({
                verified: vercelConfig.isConfigured && vercelConfig.isVerified,
                isConfigured: vercelConfig.isConfigured,
                isVerified: vercelConfig.isVerified,
                message: vercelConfig.message,
                verification: vercelConfig.verification,
            });
        }

        // Fallback: verificação DNS direta
        const dns = await import("dns/promises");

        try {
            const records = await dns.resolveCname(domain);
            const isValid = records.some(
                (r) => r.includes("vercel") || r.includes("cname.vercel-dns.com")
            );

            return NextResponse.json({
                verified: isValid,
                message: isValid
                    ? "DNS configurado corretamente!"
                    : `CNAME não aponta para Vercel. Encontrado: ${records.join(", ")}`,
            });
        } catch {
            return NextResponse.json({
                verified: false,
                message: "DNS ainda não propagou. Aguarde até 48h.",
            });
        }

    } catch (error) {
        console.error("Erro ao verificar domínio:", error);
        return NextResponse.json(
            { error: "Erro ao verificar domínio" },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Remover domínio customizado
 */
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { siteId } = await request.json();

        // Buscar site e domínio atual
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

        const { data: site } = await supabase
            .from("sites")
            .select("id, custom_domain, profile_id")
            .eq("id", siteId)
            .single();

        if (!site || site.profile_id !== profile?.id) {
            return NextResponse.json(
                { error: "Sem permissão" },
                { status: 403 }
            );
        }

        // Remover da Vercel
        if (site.custom_domain) {
            await removeDomainFromVercel(site.custom_domain);
        }

        // Remover do banco
        await supabase
            .from("sites")
            .update({ custom_domain: null })
            .eq("id", siteId);

        return NextResponse.json({
            success: true,
            message: "Domínio removido com sucesso.",
        });

    } catch (error) {
        console.error("Erro ao remover domínio:", error);
        return NextResponse.json(
            { error: "Erro ao remover domínio" },
            { status: 500 }
        );
    }
}
