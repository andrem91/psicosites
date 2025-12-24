import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function POST(request: Request) {
    try {
        const { domain } = await request.json();

        if (!domain) {
            return NextResponse.json(
                { verified: false, message: "Domínio não informado" },
                { status: 400 }
            );
        }

        // Limpar domínio
        const cleanDomain = domain
            .toLowerCase()
            .trim()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/$/, "");

        try {
            // Tentar resolver CNAME
            const records = await dns.resolveCname(cleanDomain);

            // Verificar se aponta para Vercel
            const isValid = records.some(
                (r) =>
                    r.includes("vercel") ||
                    r.includes("cname.vercel-dns.com") ||
                    r.includes(".vercel.app")
            );

            if (isValid) {
                return NextResponse.json({
                    verified: true,
                    message: "DNS configurado corretamente!",
                    records,
                });
            }

            return NextResponse.json({
                verified: false,
                message: `CNAME encontrado, mas não aponta para Vercel. Encontrado: ${records.join(", ")}`,
                records,
            });
        } catch (dnsError: unknown) {
            // Se não encontrar CNAME, tentar resolver A record
            try {
                const aRecords = await dns.resolve4(cleanDomain);

                // IPs da Vercel (podem mudar, mas são os mais comuns)
                const vercelIps = ["76.76.21.21", "76.76.21.22"];
                const isVercelIp = aRecords.some((ip) => vercelIps.includes(ip));

                if (isVercelIp) {
                    return NextResponse.json({
                        verified: true,
                        message: "DNS configurado corretamente via A record!",
                        records: aRecords,
                    });
                }

                return NextResponse.json({
                    verified: false,
                    message: "Domínio encontrado, mas não aponta para nossos servidores. Configure o CNAME conforme as instruções.",
                    records: aRecords,
                });
            } catch {
                // Domínio não encontrado
                const errorCode = (dnsError as NodeJS.ErrnoException)?.code;
                if (errorCode === "ENOTFOUND" || errorCode === "ENODATA") {
                    return NextResponse.json({
                        verified: false,
                        message: "DNS ainda não propagou. Aguarde até 48h após a configuração.",
                    });
                }

                return NextResponse.json({
                    verified: false,
                    message: "Não foi possível verificar o domínio. Verifique se digitou corretamente.",
                });
            }
        }
    } catch (error) {
        console.error("Erro ao verificar domínio:", error);
        return NextResponse.json(
            { verified: false, message: "Erro interno ao verificar domínio" },
            { status: 500 }
        );
    }
}
