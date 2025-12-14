import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Listar FAQs do site
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Buscar site do usuário
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
        }

        const { data: site } = await supabase
            .from("sites")
            .select("id")
            .eq("profile_id", profile.id)
            .single();

        if (!site) {
            return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
        }

        // Buscar FAQs
        const { data: faqs, error } = await supabase
            .from("site_faqs")
            .select("*")
            .eq("site_id", site.id)
            .order("order_index", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ faqs: faqs || [] });
    } catch (error) {
        console.error("Erro ao buscar FAQs:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST - Criar novo FAQ
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { question, answer } = body;

        if (!question || !answer) {
            return NextResponse.json({ error: "Pergunta e resposta são obrigatórios" }, { status: 400 });
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Buscar site do usuário
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
        }

        const { data: site } = await supabase
            .from("sites")
            .select("id")
            .eq("profile_id", profile.id)
            .single();

        if (!site) {
            return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
        }

        // Buscar maior order_index
        const { data: maxOrder } = await supabase
            .from("site_faqs")
            .select("order_index")
            .eq("site_id", site.id)
            .order("order_index", { ascending: false })
            .limit(1)
            .single();

        const newOrder = (maxOrder?.order_index || 0) + 1;

        // Criar FAQ
        const { data: faq, error } = await supabase
            .from("site_faqs")
            .insert({
                site_id: site.id,
                question,
                answer,
                order_index: newOrder,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ faq });
    } catch (error) {
        console.error("Erro ao criar FAQ:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// PUT - Atualizar FAQ
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { id, question, answer, is_active, order_index } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Atualizar FAQ
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (question !== undefined) updates.question = question;
        if (answer !== undefined) updates.answer = answer;
        if (is_active !== undefined) updates.is_active = is_active;
        if (order_index !== undefined) updates.order_index = order_index;

        const { data: faq, error } = await supabase
            .from("site_faqs")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ faq });
    } catch (error) {
        console.error("Erro ao atualizar FAQ:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// DELETE - Excluir FAQ
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { error } = await supabase
            .from("site_faqs")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir FAQ:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
