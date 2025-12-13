import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, profile_image_url")
        .eq("user_id", user.id)
        .single();

    const userData = {
        name: profile?.full_name || user.email?.split("@")[0] || "Usuário",
        email: user.email || "",
        avatar: profile?.profile_image_url || undefined,
    };

    return <DashboardShell user={userData}>{children}</DashboardShell>;
}
