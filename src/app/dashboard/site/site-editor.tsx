"use client";

import { Button } from "@/components/ui/button";
import { SpecialtyEditor } from "@/components/site/specialty-editor";
import { FAQEditor } from "@/components/site/faq-editor";
import { TestimonialsEditor } from "@/components/site/testimonials-editor";
import { Specialty } from "@/types/specialty";

// Hook e componentes de aba
import { useSiteEditor, TabId } from "./hooks/useSiteEditor";
import { ProfileTab, AttendanceTab, ThemeTab, SeoTab, ExtrasTab } from "./tabs";

// Tipos para o componente principal
export interface SiteEditorProps {
    profile: {
        id: string;
        full_name: string;
        crp: string;
        whatsapp: string;
        bio: string;
        bio_short?: string;
        specialties: string[];
        specialties_data?: Specialty[];
        online_service?: boolean;
        in_person_service?: boolean;
        street?: string;
        street_number?: string;
        neighborhood?: string;
        complement?: string;
        city?: string;
        state?: string;
        zip_code?: string;
        google_maps_embed?: string;
        profile_image_url?: string;
        logo_url?: string;
        video_url?: string;
        working_hours?: string;
        languages?: string[];
        target_audience?: string[];
        methodologies?: string[];
        certifications?: { title: string; institution: string; year?: string }[];
        pricing?: { service: string; price: string; duration?: string }[];
        social_links?: {
            instagram?: string;
            linkedin?: string;
            facebook?: string;
            youtube?: string;
            tiktok?: string;
            twitter?: string;
        };
    };
    site: {
        id: string;
        subdomain: string;
        site_title: string;
        meta_description: string;
        is_published: boolean;
        theme_config: {
            primaryColor: string;
            backgroundColor: string;
            fontFamily: string;
            fontPreset?: string;
        };
        show_ethics_section?: boolean;
        ethics_content?: string;
        show_lgpd_section?: boolean;
    };
}

// Definição das abas disponíveis
const TABS: { id: TabId; label: string }[] = [
    { id: "profile", label: "Perfil" },
    { id: "specialties", label: "Especialidades" },
    { id: "attendance", label: "Atendimento" },
    { id: "theme", label: "Tema" },
    { id: "seo", label: "SEO" },
    { id: "faq", label: "FAQ" },
    { id: "testimonials", label: "Depoimentos" },
    { id: "extras", label: "Extras" },
];

export function SiteEditor({ profile, site }: SiteEditorProps) {
    // Hook que gerencia todo o estado e handlers
    const editor = useSiteEditor({ profile, site });

    const {
        isPending,
        activeTab,
        setActiveTab,
        success,
        error,
        isPublished,
        handleTogglePublish,
        specialties,
        setSpecialties,
        themeData,
        handleSaveSpecialties,
        siteId,
        subdomain,
    } = editor;

    return (
        <div className="space-y-6">
            {/* Status messages */}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {success}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* URL e Status de publicação */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Endereço do seu site:</p>
                        <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${subdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            {subdomain}.psicosites.com.br
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${isPublished ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                                    }`}
                            />
                            <span className="text-sm text-gray-600">
                                {isPublished ? "Publicado" : "Rascunho"}
                            </span>
                        </div>
                        <Button
                            variant={isPublished ? "outline" : "default"}
                            size="sm"
                            onClick={handleTogglePublish}
                            isLoading={isPending}
                        >
                            {isPublished ? "Despublicar" : "Publicar"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Tab Perfil */}
                    {activeTab === "profile" && <ProfileTab editor={editor} />}

                    {/* Tab Especialidades */}
                    {activeTab === "specialties" && (
                        <SpecialtyEditor
                            specialties={specialties}
                            onChange={setSpecialties}
                            primaryColor={themeData.primaryColor}
                            isSaving={isPending}
                            onSave={handleSaveSpecialties}
                        />
                    )}

                    {/* Tab Atendimento */}
                    {activeTab === "attendance" && <AttendanceTab editor={editor} />}

                    {/* Tab Tema */}
                    {activeTab === "theme" && <ThemeTab editor={editor} />}

                    {/* Tab SEO */}
                    {activeTab === "seo" && <SeoTab editor={editor} />}

                    {/* Tab FAQ */}
                    {activeTab === "faq" && <FAQEditor siteId={siteId} />}

                    {/* Tab Depoimentos */}
                    {activeTab === "testimonials" && <TestimonialsEditor siteId={siteId} />}

                    {/* Tab Extras */}
                    {activeTab === "extras" && <ExtrasTab editor={editor} />}
                </div>
            </div>
        </div>
    );
}
