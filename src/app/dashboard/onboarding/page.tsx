import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Configurar meu site | PsiBuilder",
    description: "Configure seu site profissional em poucos passos",
};

export default async function OnboardingPage() {
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
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    // Verificar se já tem site (onboarding completo)
    const { data: site } = await supabase
        .from("sites")
        .select("id, subdomain")
        .eq("profile_id", profile.id)
        .single();

    // Se já tem site (com ID válido), redirecionar para dashboard
    if (site?.id) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Crie seu site profissional
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Configure tudo em menos de 5 minutos
                    </p>
                </div>

                {/* Card do Wizard */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <OnboardingWizard
                        profileId={profile.id}
                        initialData={{
                            full_name: profile.full_name || "",
                            crp: profile.crp || "",
                            whatsapp: profile.whatsapp || "",
                            bio: profile.bio || "",
                            bio_short: profile.bio_short || "",
                            specialties: profile.specialties || [],
                        }}
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-8">
                    Você pode editar essas informações depois nas configurações do site.
                </p>
            </div>
        </div>
    );
}
