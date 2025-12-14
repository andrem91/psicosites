import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PUT - Atualizar configurações de Ética e LGPD
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { showEthics, ethicsContent, showLgpd } = body;

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

        // Atualizar configurações
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (showEthics !== undefined) updates.show_ethics_section = showEthics;
        if (ethicsContent !== undefined) updates.ethics_content = ethicsContent;
        if (showLgpd !== undefined) updates.show_lgpd_section = showLgpd;

        const { error } = await supabase
            .from("sites")
            .update(updates)
            .eq("id", site.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
