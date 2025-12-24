import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DomainPageClient } from "./domain-page-client";

export const metadata = {
    title: "Domínio | PsicoSites",
    description: "Configure seu domínio personalizado",
};

export default async function DominioPage() {
    const supabase = await createClient();

    // Verificar autenticação
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Buscar perfil
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!profile) {
        redirect("/dashboard/onboarding");
    }

    // Buscar dados do site
    const { data: site } = await supabase
        .from("sites")
        .select("id, subdomain, custom_domain")
        .eq("profile_id", profile.id)
        .single();

    // Buscar subscription para verificar plano
    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .single();

    const isPro = subscription?.plan === "pro" && subscription?.status === "active";

    return (
        <div className="p-6 md:p-10">
            <DomainPageClient
                site={site}
                isPro={isPro}
            />
        </div>
    );
}
