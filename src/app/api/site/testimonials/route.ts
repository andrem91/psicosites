import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Listar depoimentos do site
export async function GET() {
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

        // Buscar depoimentos
        const { data: testimonials, error } = await supabase
            .from("site_testimonials")
            .select("*")
            .eq("site_id", site.id)
            .order("order_index", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ testimonials: testimonials || [] });
    } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST - Criar novo depoimento
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { authorName, content, rating } = body;

        if (!authorName || !content) {
            return NextResponse.json({ error: "Nome e depoimento são obrigatórios" }, { status: 400 });
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

        // Gerar iniciais do nome
        const initials = authorName.split(" ")
            .slice(0, 2)
            .map((n: string) => n[0])
            .join("")
            .toUpperCase();

        // Buscar maior order_index
        const { data: maxOrder } = await supabase
            .from("site_testimonials")
            .select("order_index")
            .eq("site_id", site.id)
            .order("order_index", { ascending: false })
            .limit(1)
            .single();

        const newOrder = (maxOrder?.order_index || 0) + 1;

        // Criar depoimento
        const { data: testimonial, error } = await supabase
            .from("site_testimonials")
            .insert({
                site_id: site.id,
                author_name: authorName,
                author_initials: initials,
                content,
                rating: rating || 5,
                order_index: newOrder,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ testimonial });
    } catch (error) {
        console.error("Erro ao criar depoimento:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// PUT - Atualizar depoimento
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { id, authorName, content, rating, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Atualizar depoimento
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (authorName !== undefined) {
            updates.author_name = authorName;
            updates.author_initials = authorName.split(" ")
                .slice(0, 2)
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();
        }
        if (content !== undefined) updates.content = content;
        if (rating !== undefined) updates.rating = rating;
        if (is_active !== undefined) updates.is_active = is_active;

        const { data: testimonial, error } = await supabase
            .from("site_testimonials")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ testimonial });
    } catch (error) {
        console.error("Erro ao atualizar depoimento:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// DELETE - Excluir depoimento
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
            .from("site_testimonials")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir depoimento:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
