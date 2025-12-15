import { NextRequest, NextResponse } from "next/server";

// API route for contact form submissions
// In the future, this can integrate with Resend or other email providers
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, message, psychologistName, psychologistEmail } = body;

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

        // Log the contact submission (for now)
        // TODO: Implement email sending with Resend
        console.log("📧 Contact Form Submission:", {
            from: { name, email, phone },
            to: { psychologistName, psychologistEmail },
            message,
            timestamp: new Date().toISOString(),
        });

        // Future implementation with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //     from: "PsiBuilder <noreply@psibuilder.com.br>",
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
