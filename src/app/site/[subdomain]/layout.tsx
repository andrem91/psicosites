import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter, WhatsAppButton } from "@/components/site";
import { ReactNode } from "react";

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

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <SiteHeader
                siteName={profile?.full_name || "Psicólogo"}
                logo={profile?.profile_image_url}
                primaryColor={primaryColor}
                navItems={[
                    { label: "Início", href: "/" },
                    { label: "Sobre", href: "#sobre" },
                    { label: "Blog", href: "/blog" },
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
            />

            {/* Botão WhatsApp flutuante */}
            {profile?.whatsapp && (
                <WhatsAppButton
                    whatsapp={profile.whatsapp}
                    message={`Olá ${profile.full_name?.split(" ")[0]}! Vi seu site e gostaria de agendar uma consulta.`}
                />
            )}
        </div>
    );
}
