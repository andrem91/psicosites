import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlansPageClient } from "./plans-page-client";

export default async function PlanosPage() {
    const supabase = await createClient();

    // Verificar autenticação
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Buscar assinatura atual
    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .single();

    const currentPlan = subscription?.plan || "free";
    const subscriptionStatus = subscription?.status || "active";

    return (
        <div className="p-6 md:p-10">
            <PlansPageClient
                currentPlan={currentPlan}
                subscriptionStatus={subscriptionStatus}
            />
        </div>
    );
}

