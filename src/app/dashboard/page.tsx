import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dashboard | PsicoSites",
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

    // Calcular progresso do perfil (incluindo novos campos)
    const profileFields = ["full_name", "whatsapp", "crp", "bio", "profile_image_url", "gender"];
    const filledFields = profileFields.filter((field) => {
        const value = profile?.[field as keyof typeof profile];
        // Para gender, "not_specified" conta como não preenchido
        if (field === "gender") return value && value !== "not_specified";
        return !!value;
    }).length;
    const profileProgress = Math.round((filledFields / profileFields.length) * 100);

    // Se não tem site, mostrar CTA para onboarding
    const showOnboardingCTA = !site;

    return (
        <div className="space-y-8">
            {/* Banner de Onboarding */}
            {showOnboardingCTA && (
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">
                            🚀 Crie seu site profissional agora!
                        </h2>
                        <p className="text-indigo-100 mb-6 max-w-lg">
                            Configure tudo em menos de 5 minutos e comece a receber pacientes.
                        </p>
                        <Link href="/dashboard/onboarding">
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                                Começar configuração
                            </Button>
                        </Link>
                    </div>
                    {/* Decoração */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -right-5 -bottom-10 w-32 h-32 bg-white/5 rounded-full" />
                </div>
            )}

            {/* Saudação */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Olá, {profile?.full_name?.split(" ")[0] || "Profissional"}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Bem-vindo ao seu painel. {!site ? "Vamos criar seu site profissional?" : "Gerencie seu site aqui."}
                </p>
            </div>

            {/* Card informativo: Acesso pelo próprio site */}
            {site?.subdomain && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            💡 Sabia que você pode acessar este painel pelo seu próprio site?
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Acesse pelo link &quot;Área do Profissional&quot; no rodapé de{" "}
                            <a
                                href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${site.subdomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-700 underline"
                            >
                                {site.subdomain}.psicosites.com.br
                            </a>
                        </p>
                    </div>
                </div>
            )}


            {/* Status do site */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-lg mb-1">Status do seu site</h2>
                        <p className="text-indigo-100 text-sm">
                            {site?.is_published
                                ? `Publicado em ${site.subdomain}.psicosites.com.br`
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
                {profileProgress < 100 ? (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progresso do perfil</span>
                            <span>{profileProgress}%</span>
                        </div>
                        <Progress
                            value={profileProgress}
                            className="h-2 bg-white/20"
                        />
                    </div>
                ) : (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Perfil 100% completo!</span>
                    </div>
                )}
            </div>

            {/* Cards de ação rápida */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card: Completar Perfil (aparece se perfil incompleto E já tem site) */}
                {profileProgress < 100 && site && (
                    <div className="bg-white rounded-2xl border border-amber-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-amber-600"
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
                            Adicione foto, gênero e outras informações para melhorar seu site.
                        </p>
                        <Link href="/dashboard/onboarding">
                            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                                Completar agora
                            </Button>
                        </Link>
                    </div>
                )}

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
                            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${site.subdomain}`}
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

                {/* Card: Perfil Completo (aparece por último quando 100%) */}
                {profileProgress >= 100 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow opacity-80">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Perfil Completo ✓</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Seu perfil está completo. Edite quando quiser.
                        </p>
                        <Link href="/dashboard/conta">
                            <Button size="sm" variant="outline" className="w-full text-gray-600">
                                Editar perfil
                            </Button>
                        </Link>
                    </div>
                )}
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
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Publique seu site</strong> para que pacientes possam encontrá-lo
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Adicione depoimentos</strong> de pacientes para gerar confiança
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Preencha o FAQ</strong> com dúvidas frequentes para ajudar pacientes
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Personalize as cores</strong> do site para refletir sua identidade
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Compartilhe seu site</strong> nas redes sociais e WhatsApp
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <span>
                            <strong>Mantenha o texto &quot;Sobre mim&quot;</strong> atualizado e autêntico
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
