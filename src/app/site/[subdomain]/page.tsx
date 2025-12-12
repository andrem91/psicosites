import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface SitePageProps {
    params: Promise<{ subdomain: string }>;
}

// Função para buscar dados do site
async function getSiteData(subdomain: string) {
    const supabase = await createClient();

    // Buscar site pelo subdomínio ou domínio customizado
    const { data: site, error } = await supabase
        .from("sites")
        .select(
            `
      *,
      profiles (
        full_name,
        email,
        whatsapp,
        crp,
        specialties,
        bio,
        profile_image_url
      )
    `
        )
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
        .eq("is_published", true)
        .single();

    if (error || !site) {
        return null;
    }

    return site;
}

// Gerar metadata dinâmica
export async function generateMetadata({
    params,
}: SitePageProps): Promise<Metadata> {
    const { subdomain } = await params;
    const site = await getSiteData(subdomain);

    if (!site) {
        return {
            title: "Site não encontrado",
        };
    }

    const profile = site.profiles;

    return {
        title: site.site_title || `${profile?.full_name} - Psicólogo(a)`,
        description:
            site.meta_description ||
            profile?.bio ||
            `Site profissional de ${profile?.full_name}`,
        keywords: site.meta_keywords || profile?.specialties?.join(", "),
        openGraph: {
            title: site.site_title || profile?.full_name,
            description: site.meta_description || profile?.bio,
            images: profile?.profile_image_url ? [profile.profile_image_url] : [],
        },
    };
}

export default async function SiteHomePage({ params }: SitePageProps) {
    const { subdomain } = await params;
    const site = await getSiteData(subdomain);

    if (!site) {
        notFound();
    }

    const profile = site.profiles;
    const theme = site.theme_config || {};

    // Cores do tema
    const primaryColor = theme.primaryColor || "#6366f1";
    const backgroundColor = theme.backgroundColor || "#ffffff";

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor }}
        >
            {/* Hero Section */}
            <header
                className="relative py-20 px-4"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
            >
                <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Foto do profissional */}
                    {profile?.profile_image_url && (
                        <div className="mb-6">
                            <img
                                src={profile.profile_image_url}
                                alt={profile.full_name}
                                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                    )}

                    {/* Nome */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {profile?.full_name}
                    </h1>

                    {/* CRP */}
                    {profile?.crp && (
                        <p className="text-lg opacity-90 mb-2">CRP: {profile.crp}</p>
                    )}

                    {/* Especialidades */}
                    {profile?.specialties && profile.specialties.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {profile.specialties.map((specialty: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-white/20 rounded-full text-sm"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Sobre Section */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2
                        className="text-3xl font-bold mb-6 text-center"
                        style={{ color: primaryColor }}
                    >
                        Sobre mim
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed text-center">
                        {profile?.bio || "Psicólogo(a) especialista em saúde mental."}
                    </p>
                </div>
            </section>

            {/* CTA WhatsApp */}
            {profile?.whatsapp && (
                <section className="py-12 px-4 bg-gray-50">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Agende sua consulta
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Entre em contato pelo WhatsApp e marque seu horário.
                        </p>
                        <a
                            href={`https://wa.me/55${profile.whatsapp.replace(/\D/g, "")}?text=Olá! Vi seu site e gostaria de agendar uma consulta.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                            style={{ backgroundColor: "#25D366" }}
                            data-track="whatsapp-click"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Falar no WhatsApp
                        </a>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-gray-200">
                <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} {profile?.full_name}. Todos os direitos reservados.</p>
                    <p className="mt-2">
                        Site criado com{" "}
                        <a
                            href="https://psibuilder.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            PsiBuilder
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
