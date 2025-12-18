import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PUT - Atualizar visibilidade do blog
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { siteId, showBlog } = body;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Verificar se o site pertence ao usuário
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
            .eq("id", siteId)
            .eq("profile_id", profile.id)
            .single();

        if (!site) {
            return NextResponse.json({ error: "Site não encontrado" }, { status: 404 });
        }

        // Atualizar configuração
        const { error } = await supabase
            .from("sites")
            .update({
                show_blog: showBlog,
                updated_at: new Date().toISOString(),
            })
            .eq("id", siteId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao atualizar visibilidade do blog:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
