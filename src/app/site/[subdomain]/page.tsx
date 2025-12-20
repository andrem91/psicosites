import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SiteTracker } from "@/components/site/site-tracker";
import { SiteProfile, SiteSpecialty, SiteFAQ, SiteTestimonial } from "@/types/site-types";
import {
    SiteHeroSection,
    SiteAboutSection,
    SiteSpecialtiesSection,
    SiteModalitiesSection,
    SiteLocationSection,
    SiteContactSection,
    SiteTestimonialsSection,
    SiteFAQSection,
} from "@/components/site/sections";
import { SiteVideoSection } from "@/components/site/sections/site-video";
import { SiteCertificationsSection } from "@/components/site/sections/site-certifications";
import { SitePricingSection } from "@/components/site/sections/site-pricing";
import { SiteInfoSection } from "@/components/site/sections/site-info";

interface SitePageProps {
    params: Promise<{ subdomain: string }>;
}

interface SiteData {
    id: string;
    site_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    theme_config?: { primaryColor?: string };
    show_ethics_section?: boolean;
    ethics_content?: string;
    profiles: SiteProfile;
    faqs: SiteFAQ[];
    testimonials: SiteTestimonial[];
}

// Função para buscar dados do site
async function getSiteData(subdomain: string): Promise<SiteData | null> {
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
        gender,
        professional_title,
        specialties,
        specialties_data,
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
        google_maps_embed,
        social_links,
        video_url,
        working_hours,
        languages,
        target_audience,
        methodologies,
        certifications,
        pricing,
        instagram_url
      )
    `
        )
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
        .eq("is_published", true)
        .single();

    if (error || !site) {
        return null;
    }

    // Buscar FAQs e Testimonials em paralelo (performance)
    const [faqsResult, testimonialsResult] = await Promise.all([
        supabase
            .from("site_faqs")
            .select("*")
            .eq("site_id", site.id)
            .eq("is_active", true)
            .order("order_index", { ascending: true }),
        supabase
            .from("site_testimonials")
            .select("*")
            .eq("site_id", site.id)
            .eq("is_active", true)
            .order("order_index", { ascending: true }),
    ]);

    return {
        ...site,
        faqs: faqsResult.data || [],
        testimonials: testimonialsResult.data || []
    } as SiteData;
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

            {/* Hero Section */}
            <SiteHeroSection profile={profile} primaryColor={primaryColor} />

            {/* Vídeo de Apresentação (opcional) */}
            <SiteVideoSection profile={profile} primaryColor={primaryColor} />

            {/* Sobre Section */}
            <SiteAboutSection
                bio={profile?.bio}
                primaryColor={primaryColor}
                socialLinks={profile?.social_links}
            />

            {/* Especialidades */}
            <SiteSpecialtiesSection
                specialties={profile?.specialties}
                specialtiesData={profile?.specialties_data as SiteSpecialty[]}
                primaryColor={primaryColor}
            />

            {/* Informações do Atendimento (horários, idiomas, público-alvo, metodologias) */}
            <SiteInfoSection profile={profile} primaryColor={primaryColor} />

            {/* Certificações e Formações (opcional) */}
            <SiteCertificationsSection profile={profile} primaryColor={primaryColor} />

            {/* Preços/Valores (opcional) */}
            <SitePricingSection profile={profile} primaryColor={primaryColor} />

            {/* Modalidades de Atendimento */}
            <SiteModalitiesSection
                onlineService={profile?.online_service}
                inPersonService={profile?.in_person_service}
                primaryColor={primaryColor}
            />

            {/* Localização */}
            <SiteLocationSection profile={profile} primaryColor={primaryColor} />

            {/* Contato */}
            <SiteContactSection profile={profile} primaryColor={primaryColor} />

            {/* Depoimentos */}
            <SiteTestimonialsSection
                testimonials={site.testimonials}
                primaryColor={primaryColor}
            />

            {/* FAQ */}
            <SiteFAQSection faqs={site.faqs} primaryColor={primaryColor} />
        </>
    );
}

