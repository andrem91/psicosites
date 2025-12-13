import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dashboard | PsiBuilder",
    description: "Gerencie seu site profissional",
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Buscar perfil do usuário
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

    // Buscar site do usuário (se existir)
    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

    // Calcular progresso do perfil
    const profileFields = ["full_name", "whatsapp", "crp", "bio"];
    const filledFields = profileFields.filter(
        (field) => profile?.[field as keyof typeof profile]
    ).length;
    const profileProgress = Math.round((filledFields / profileFields.length) * 100);

    return (
        <div className="space-y-8">
            {/* Saudação */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Olá, {profile?.full_name?.split(" ")[0] || "Profissional"}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Bem-vindo ao seu painel. {!site ? "Vamos criar seu site profissional?" : "Gerencie seu site aqui."}
                </p>
            </div>

            {/* Status do site */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-lg mb-1">Status do seu site</h2>
                        <p className="text-indigo-100 text-sm">
                            {site?.is_published
                                ? `Publicado em ${site.subdomain}.psibuilder.com.br`
                                : "Complete seu perfil para publicar"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-3 h-3 rounded-full ${site?.is_published ? "bg-green-400" : "bg-yellow-400 animate-pulse"
                                }`}
                        />
                        <span className="text-sm font-medium">
                            {site?.is_published ? "Online" : "Rascunho"}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Progresso do perfil</span>
                        <span>{profileProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${profileProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Cards de ação rápida */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card: Completar perfil */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                        <svg
                            className="w-6 h-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Completar Perfil</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Adicione suas informações profissionais, CRP e foto.
                    </p>
                    <Link href="/dashboard/conta">
                        <Button size="sm" className="w-full">
                            {profileProgress < 100 ? "Completar agora" : "Editar perfil"}
                        </Button>
                    </Link>
                </div>

                {/* Card: Personalizar site */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                        <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalizar Site</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Escolha cores, fontes e configure seu site.
                    </p>
                    <Link href="/dashboard/site">
                        <Button size="sm" variant="outline" className="w-full">
                            Personalizar
                        </Button>
                    </Link>
                </div>

                {/* Card: Ver site */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ver Meu Site</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Visualize como seu site aparece para os pacientes.
                    </p>
                    {site?.subdomain ? (
                        <a
                            href={`http://${site.subdomain}.localhost:3000`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="sm" variant="outline" className="w-full">
                                Visualizar
                            </Button>
                        </a>
                    ) : (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                            Crie seu site primeiro
                        </Button>
                    )}
                </div>
            </div>

            {/* Dicas rápidas */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    Dicas para seu site
                </h2>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                            Adicione uma foto profissional para aumentar a confiança dos pacientes
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                            Preencha suas especialidades para aparecer em buscas relacionadas
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                            Configure seu WhatsApp para receber contatos diretamente pelo site
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
