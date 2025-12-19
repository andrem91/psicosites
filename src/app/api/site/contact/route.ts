import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// API route for contact form submissions
// In the future, this can integrate with Resend or other email providers
export async function POST(request: NextRequest) {
    // Rate limit: 2 requests per 60 seconds (contact forms)
    const ip = getClientIP(request);
    const rateLimitResult = await checkRateLimit(ip, "contact");
    if ("status" in rateLimitResult) {
        return rateLimitResult; // Rate limited
    }

    try {
        const body = await request.json();
        const { name, email, phone: _phone, message, psychologistName: _psychologistName, psychologistEmail: _psychologistEmail } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Nome, email e mensagem são obrigatórios" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 400 }
            );
        }

        // TODO: Implement email sending with Resend

        // Future implementation with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //     from: "PsicoSites <noreply@psicosites.com.br>",
        //     to: psychologistEmail,
        //     subject: `Novo contato via site - ${name}`,
        //     html: `<p>Nome: ${name}</p><p>Email: ${email}</p><p>Telefone: ${phone || 'Não informado'}</p><p>Mensagem: ${message}</p>`,
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Erro interno ao processar mensagem" },
            { status: 500 }
        );
    }
}
