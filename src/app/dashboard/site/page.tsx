import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SiteEditor } from "./site-editor";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Meu Site | PsicoSites",
    description: "Configure e personalize seu site profissional",
};

export default async function SitePage() {
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

    // Buscar site do usuário
    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("profile_id", profile.id)
        .single();

    // Se não tem site, redirecionar para onboarding
    if (!site) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meu Site</h1>
                    <p className="text-gray-500 mt-1">
                        Configure e personalize seu site profissional
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Você ainda não tem um site
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Complete o processo de configuração para criar seu site profissional.
                    </p>
                    <Link href="/dashboard/onboarding">
                        <Button>Criar meu site</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meu Site</h1>
                    <p className="text-gray-500 mt-1">
                        Configure e personalize seu site profissional
                    </p>
                </div>
                <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${site.subdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver site
                    </Button>
                </a>
            </div>

            {/* Editor */}
            <SiteEditor
                profile={{
                    id: profile.id,
                    full_name: profile.full_name || "",
                    crp: profile.crp || "",
                    whatsapp: profile.whatsapp || "",
                    bio: profile.bio || "",
                    bio_short: profile.bio_short || "",
                    specialties: profile.specialties || [],
                    specialties_data: profile.specialties_data || [],
                    profile_image_url: profile.profile_image_url,
                    logo_url: profile.logo_url,
                    online_service: profile.online_service ?? true,
                    in_person_service: profile.in_person_service ?? false,
                    street: profile.street || "",
                    street_number: profile.street_number || "",
                    neighborhood: profile.neighborhood || "",
                    complement: profile.complement || "",
                    city: profile.city || "",
                    state: profile.state || "",
                    zip_code: profile.zip_code || "",
                    google_maps_embed: profile.google_maps_embed || "",
                    social_links: profile.social_links || {},
                }}
                site={{
                    id: site.id,
                    subdomain: site.subdomain,
                    site_title: site.site_title || "",
                    meta_description: site.meta_description || "",
                    is_published: site.is_published,
                    theme_config: site.theme_config || {
                        primaryColor: "#5B8FB9",
                        backgroundColor: "#ffffff",
                        fontFamily: "Inter",
                    },
                }}
            />
        </div>
    );
}
