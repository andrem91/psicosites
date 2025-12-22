import { createClient } from "@/lib/supabase/server";
import { SiteHeader, SiteFooter, WhatsAppButton } from "@/components/site";
import { ReactNode } from "react";
import { getFontPreset, getGoogleFontsUrl, getFontCSSVariables } from "@/lib/font-presets";

interface SiteLayoutProps {
    children: ReactNode;
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
        profile_image_url,
        logo_url,
        in_person_service,
        street,
        street_number,
        neighborhood,
        city,
        state,
        social_links
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

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
    const { subdomain } = await params;
    const site = await getSiteData(subdomain);

    // Se não encontrou o site, deixa o children lidar (mostrará not-found)
    if (!site) {
        return <>{children}</>;
    }

    const profile = site.profiles;
    const theme = site.theme_config || {};
    const primaryColor = theme.primaryColor || "#6366f1";

    // Obter preset de fonte
    const fontPreset = getFontPreset(theme.fontPreset);
    const googleFontsUrl = getGoogleFontsUrl(fontPreset);
    const fontVariables = getFontCSSVariables(fontPreset);

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={googleFontsUrl} rel="stylesheet" />

            <div
                className="min-h-screen flex flex-col"
                style={fontVariables as React.CSSProperties}
            >
                {/* Header */}
                <SiteHeader
                    siteName={profile?.full_name || "Psicólogo"}
                    logo={profile?.logo_url}
                    primaryColor={primaryColor}
                    fontPreset={fontPreset}
                    navItems={[
                        { label: "Início", href: "#inicio" },
                        { label: "Sobre", href: "#sobre" },
                        { label: "Especialidades", href: "#especialidades" },
                        ...(site.show_blog !== false ? [{ label: "Blog", href: "./blog" }] : []),
                        { label: "Contato", href: "#contato" },
                    ]}
                />

                {/* Conteúdo principal */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <SiteFooter
                    siteName={profile?.full_name || "Psicólogo"}
                    crp={profile?.crp}
                    email={profile?.email}
                    whatsapp={profile?.whatsapp}
                    primaryColor={primaryColor}
                    showLgpd={site.show_lgpd_section !== false}
                    showBlog={site.show_blog !== false}
                    socialLinks={profile?.social_links}
                    inPersonService={profile?.in_person_service}
                    street={profile?.street}
                    streetNumber={profile?.street_number}
                    neighborhood={profile?.neighborhood}
                    city={profile?.city}
                    state={profile?.state}
                />

                {/* Botão WhatsApp flutuante */}
                {profile?.whatsapp && (
                    <WhatsAppButton
                        whatsapp={profile.whatsapp}
                        message={`Olá ${profile.full_name?.split(" ")[0]}! Vi seu site e gostaria de agendar uma consulta.`}
                    />
                )}
            </div>
        </>
    );
}


