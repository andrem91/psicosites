import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SiteTracker } from "@/components/site/site-tracker";
import { ContactForm } from "@/components/site/contact-form";

interface SitePageProps {
    params: Promise<{ subdomain: string }>;
}

// Função para buscar dados do site
async function getSiteData(subdomain: string) {
    const supabase = await createClient();

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
        bio_short,
        profile_image_url,
        logo_url,
        online_service,
        in_person_service,
        street,
        street_number,
        neighborhood,
        complement,
        city,
        state,
        zip_code,
        google_maps_embed
      )
    `
        )
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
        .eq("is_published", true)
        .single();

    if (error || !site) {
        return null;
    }

    // Buscar FAQs do site
    const { data: faqs } = await supabase
        .from("site_faqs")
        .select("*")
        .eq("site_id", site.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    // Buscar depoimentos do site
    const { data: testimonials } = await supabase
        .from("site_testimonials")
        .select("*")
        .eq("site_id", site.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    return { ...site, faqs: faqs || [], testimonials: testimonials || [] };
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
    const primaryColor = theme.primaryColor || "#6366f1";

    return (
        <>
            {/* Tracking de Estatísticas */}
            <SiteTracker siteId={site.id} />

            {/* Hero Section - Layout Side by Side */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
                {/* Fundo limpo */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

                {/* Conteúdo */}
                <div className="relative max-w-7xl mx-auto px-4 py-16 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Lado Direito - Imagem */}
                        <div className="order-2 lg:order-2 flex justify-center lg:justify-end">
                            {profile?.profile_image_url ? (
                                <div className="relative">
                                    {/* Sombra decorativa */}
                                    <div
                                        className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <img
                                        src={profile.profile_image_url}
                                        alt={profile.full_name}
                                        className="relative w-80 h-80 lg:w-[512px] lg:h-[512px] object-cover rounded-3xl shadow-2xl"
                                        style={{ imageRendering: 'auto' }}
                                        loading="eager"
                                    />
                                    {/* Detalhe decorativo */}
                                    <div
                                        className="absolute -bottom-3 -left-3 w-24 h-24 rounded-2xl -z-10"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-80 h-80 lg:w-[512px] lg:h-[512px] rounded-3xl flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Lado Esquerdo - Informações */}
                        <div className="order-1 lg:order-1 text-center lg:text-left">
                            {/* Tag de identificação */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                                style={{
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor
                                }}
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                Psicólogo(a)
                            </div>

                            {/* Nome */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                                {profile?.full_name}
                            </h1>

                            {/* CRP */}
                            {profile?.crp && (
                                <p className="text-lg text-gray-500 mb-6">
                                    CRP: {profile.crp}
                                </p>
                            )}

                            {/* Frase de apresentação */}
                            {(profile?.bio_short || profile?.bio) && (
                                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
                                    {profile.bio_short || profile.bio}
                                </p>
                            )}

                            {/* Especialidades */}
                            {profile?.specialties && profile.specialties.length > 0 && (
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-10">
                                    {profile.specialties.slice(0, 4).map((specialty: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-full text-sm font-medium border"
                                            style={{
                                                borderColor: `${primaryColor}30`,
                                                color: primaryColor,
                                                backgroundColor: `${primaryColor}08`
                                            }}
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                    {profile.specialties.length > 4 && (
                                        <span className="px-4 py-2 text-sm text-gray-500">
                                            +{profile.specialties.length - 4} mais
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <a
                                    href="#contato"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Agendar Consulta
                                </a>
                                <a
                                    href="#sobre"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    Conhecer mais
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decoração de fundo */}
                <div
                    className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
                    style={{ backgroundColor: primaryColor }}
                />
                <div
                    className="absolute bottom-20 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
                    style={{ backgroundColor: primaryColor }}
                />
            </section>

            {/* Sobre Section */}
            <section id="sobre" className="py-20 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2
                        className="text-3xl font-bold mb-8 text-center"
                        style={{ color: primaryColor }}
                    >
                        Sobre mim
                    </h2>
                    {profile?.bio ? (
                        <div
                            className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-800 prose-a:text-indigo-600 prose-blockquote:border-indigo-500 text-center [&_p]:text-center [&_h2]:text-center [&_h3]:text-center"
                            dangerouslySetInnerHTML={{ __html: profile.bio }}
                        />
                    ) : (
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            Psicólogo(a) comprometido(a) com o bem-estar e a saúde mental dos meus pacientes. Ofereço um espaço seguro e acolhedor para que você possa expressar seus sentimentos e trabalhar em direção a uma vida mais equilibrada e feliz.
                        </p>
                    )}
                </div>
            </section>

            {/* Serviços / Especialidades */}
            {profile?.specialties && profile.specialties.length > 0 && (
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-12 text-center"
                            style={{ color: primaryColor }}
                        >
                            Áreas de Atuação
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.specialties.map((specialty: string, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: primaryColor + "15" }}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {specialty}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Atendimento especializado e humanizado.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Modalidades de Atendimento */}
            {(profile?.online_service || profile?.in_person_service) && (
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-8 text-center"
                            style={{ color: primaryColor }}
                        >
                            Modalidades de Atendimento
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {profile.online_service && (
                                <div className="p-6 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: primaryColor + "15" }}
                                    >
                                        <svg
                                            className="w-7 h-7"
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Atendimento Online
                                    </h3>
                                    <p className="text-gray-500">
                                        Sessões por videochamada de qualquer lugar do Brasil. Flexibilidade e conforto para você.
                                    </p>
                                </div>
                            )}
                            {profile.in_person_service && (
                                <div className="p-6 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: primaryColor + "15" }}
                                    >
                                        <svg
                                            className="w-7 h-7"
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Atendimento Presencial
                                    </h3>
                                    <p className="text-gray-500">
                                        Sessões no consultório. Um espaço acolhedor para suas sessões.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Mapa do Google Maps - apenas se presencial */}
            {profile?.in_person_service && profile?.street && (
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-8 text-center"
                            style={{ color: primaryColor }}
                        >
                            Localização
                        </h2>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {/* Endereço */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: primaryColor + "15" }}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            style={{ color: primaryColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {profile.street}{profile.street_number && `, ${profile.street_number}`}
                                            {profile.complement && ` - ${profile.complement}`}
                                        </p>
                                        <p className="text-gray-500">
                                            {profile.neighborhood && `${profile.neighborhood} - `}
                                            {profile.city}{profile.state && ` - ${profile.state}`}
                                            {profile.zip_code && ` - CEP: ${profile.zip_code}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Google Maps Embed - prioriza embed personalizado */}
                            <div className="aspect-video">
                                {profile.google_maps_embed ? (
                                    <div
                                        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                                        dangerouslySetInnerHTML={{ __html: profile.google_maps_embed }}
                                    />
                                ) : (
                                    <iframe
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(`${profile.street}${profile.street_number ? ` ${profile.street_number}` : ""}, ${profile.neighborhood || ""}, ${profile.city}, ${profile.state}`)}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                )}
                            </div>
                            {/* Link para abrir no Google Maps */}
                            <div className="p-4 bg-gray-50">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${profile.street}${profile.street_number ? ` ${profile.street_number}` : ""}, ${profile.neighborhood || ""}, ${profile.city}, ${profile.state}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-sm font-medium hover:underline"
                                    style={{ color: primaryColor }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Abrir no Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contato Section */}
            <section id="contato" className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2
                        className="text-3xl font-bold mb-6 text-center"
                        style={{ color: primaryColor }}
                    >
                        Entre em Contato
                    </h2>
                    <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                        Dê o primeiro passo para cuidar da sua saúde mental. Entre em contato
                        e agende sua consulta.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Contact Form */}
                        <ContactForm
                            primaryColor={primaryColor}
                            psychologistName={profile?.full_name}
                            psychologistEmail={profile?.email}
                        />

                        {/* Quick Contact Options */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Contato Rápido</h3>
                                <div className="space-y-4">
                                    {/* WhatsApp */}
                                    {profile?.whatsapp && (
                                        <a
                                            href={`https://wa.me/55${profile.whatsapp.replace(/\D/g, "")}?text=Olá! Vi seu site e gostaria de agendar uma consulta.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-[#25D366] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                                            data-track="whatsapp-click"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold">WhatsApp</p>
                                                <p className="text-sm opacity-90">{profile.whatsapp}</p>
                                            </div>
                                        </a>
                                    )}

                                    {/* Email */}
                                    {profile?.email && (
                                        <a
                                            href={`mailto:${profile.email}`}
                                            className="flex items-center gap-3 p-4 border-2 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                                            style={{ borderColor: primaryColor, color: primaryColor }}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold">E-mail</p>
                                                <p className="text-sm opacity-80" style={{ color: "inherit" }}>{profile.email}</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="text-center text-gray-500 text-sm">
                                <p>✨ Respondo em até 24 horas úteis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Depoimentos Section */}
            {site.testimonials && site.testimonials.length > 0 && (
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-10 text-center"
                            style={{ color: primaryColor }}
                        >
                            O que dizem sobre mim
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {site.testimonials.map((testimonial: {
                                id: string;
                                author_name: string;
                                author_initials: string;
                                content: string;
                                rating: number
                            }) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                                >
                                    {/* Estrelas */}
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-lg ${star <= testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Conteúdo */}
                                    <p className="text-gray-600 italic mb-4">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                    {/* Autor */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {testimonial.author_initials}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {testimonial.author_name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {site.faqs && site.faqs.length > 0 && (
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-10 text-center"
                            style={{ color: primaryColor }}
                        >
                            Perguntas Frequentes
                        </h2>

                        <div className="space-y-4">
                            {site.faqs.map((faq: { id: string; question: string; answer: string }) => (
                                <details
                                    key={faq.id}
                                    className="group bg-white rounded-xl shadow-sm border border-gray-100"
                                >
                                    <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900">
                                        {faq.question}
                                        <svg
                                            className="w-5 h-5 transition-transform group-open:rotate-180 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <p className="px-6 pb-6 text-gray-600 whitespace-pre-wrap">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Compromisso Ético Section */}
            {site.show_ethics_section !== false && site.ethics_content && (
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <h2
                            className="text-3xl font-bold mb-10 text-center"
                            style={{ color: primaryColor }}
                        >
                            🤝 Compromisso Ético
                        </h2>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {site.ethics_content}
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
