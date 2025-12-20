"use client";

import { useState, useTransition } from "react";
import { updateProfile, updateSiteConfig, togglePublishSite } from "../actions";
import { Specialty } from "@/types/specialty";
import { DEFAULT_FONT_PRESET } from "@/lib/font-presets";

// Tipos compartilhados
export interface ProfileData {
    full_name: string;
    crp: string;
    whatsapp: string;
    bio: string;
    bio_short: string;
}

export interface AttendanceData {
    online_service: boolean;
    in_person_service: boolean;
    street: string;
    street_number: string;
    neighborhood: string;
    complement: string;
    city: string;
    state: string;
    zip_code: string;
    google_maps_embed: string;
}

export interface ThemeData {
    primaryColor: string;
    fontPreset: string;
}

export interface SeoData {
    site_title: string;
    meta_description: string;
}

export interface ExtrasData {
    video_url: string;
    working_hours: string;
    languages: string;
    target_audience: string;
    methodologies: string;
}

export interface SocialLinks {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string; // X
}

export interface Certification {
    title: string;
    institution: string;
    year?: string;
}

export interface PricingItem {
    service: string;
    price: string;
    duration?: string;
}

export type TabId = "profile" | "attendance" | "specialties" | "theme" | "seo" | "faq" | "testimonials" | "extras";

// Função para remover tags HTML de uma string
function stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
}

interface UseSiteEditorProps {
    profile: {
        id: string;
        full_name: string;
        crp: string;
        whatsapp: string;
        bio: string;
        bio_short?: string;
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
        specialties?: string[];
        specialties_data?: Specialty[];
        video_url?: string;
        working_hours?: string;
        languages?: string[];
        target_audience?: string[];
        methodologies?: string[];
        certifications?: Certification[];
        pricing?: PricingItem[];
        social_links?: SocialLinks;
    };
    site: {
        id: string;
        subdomain: string;
        site_title: string;
        meta_description: string;
        is_published: boolean;
        theme_config?: {
            primaryColor: string;
            fontPreset?: string;
        };
    };
}

export function useSiteEditor({ profile, site }: UseSiteEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Image states
    const [profileImageUrl, setProfileImageUrl] = useState(profile.profile_image_url || "");
    const [logoUrl, setLogoUrl] = useState(profile.logo_url || "");

    // Form states
    const [profileData, setProfileData] = useState<ProfileData>({
        full_name: profile.full_name || "",
        crp: profile.crp || "",
        whatsapp: profile.whatsapp || "",
        bio: profile.bio || "",
        bio_short: profile.bio_short || "",
    });

    const [attendanceData, setAttendanceData] = useState<AttendanceData>({
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
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const [themeData, setThemeData] = useState<ThemeData>({
        primaryColor: site.theme_config?.primaryColor || "#5B8FB9",
        fontPreset: site.theme_config?.fontPreset || DEFAULT_FONT_PRESET,
    });

    const [seoData, setSeoData] = useState<SeoData>({
        site_title: site.site_title || "",
        meta_description: stripHtml(site.meta_description || ""),
    });

    const [specialties, setSpecialties] = useState<Specialty[]>(
        (profile.specialties_data as Specialty[]) ||
        (profile.specialties || []).map((name: string) => ({ name, description: "", icon: "heart" }))
    );

    const [isPublished, setIsPublished] = useState(site.is_published);

    const [extrasData, setExtrasData] = useState<ExtrasData>({
        video_url: profile.video_url || "",
        working_hours: profile.working_hours || "",
        languages: (profile.languages || []).join(", "),
        target_audience: (profile.target_audience || []).join(", "),
        methodologies: (profile.methodologies || []).join(", "),
    });

    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        instagram: profile.social_links?.instagram || "",
        linkedin: profile.social_links?.linkedin || "",
        facebook: profile.social_links?.facebook || "",
        youtube: profile.social_links?.youtube || "",
        tiktok: profile.social_links?.tiktok || "",
        twitter: profile.social_links?.twitter || "",
    });

    const [certifications, setCertifications] = useState<Certification[]>(
        profile.certifications || []
    );
    const [pricing, setPricing] = useState<PricingItem[]>(
        profile.pricing || []
    );

    // Helper para mostrar mensagem de sucesso temporária
    const showSuccess = (message: string) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
    };

    // Handlers de salvamento
    const handleSaveProfile = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const result = await updateProfile(profile.id, profileData);
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Perfil salvo com sucesso!");
            }
        });
    };

    const handleSaveAttendance = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const result = await updateProfile(profile.id, attendanceData);
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Modalidades de atendimento salvas!");
            }
        });
    };

    const handleSaveTheme = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const result = await updateSiteConfig(site.id, {
                theme_config: {
                    primaryColor: themeData.primaryColor,
                    backgroundColor: "#ffffff",
                    fontFamily: "Inter",
                    fontPreset: themeData.fontPreset,
                },
            });
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Tema salvo com sucesso!");
            }
        });
    };

    const handleSaveSeo = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const result = await updateSiteConfig(site.id, seoData);
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Configurações de SEO salvas!");
            }
        });
    };

    const handleTogglePublish = () => {
        startTransition(async () => {
            const result = await togglePublishSite(site.id, !isPublished);
            if (result.error) {
                setError(result.error);
            } else {
                setIsPublished(!isPublished);
                showSuccess(isPublished ? "Site despublicado" : "Site publicado com sucesso!");
            }
        });
    };

    const handleSaveSpecialties = () => {
        setError(null);
        startTransition(async () => {
            const result = await updateProfile(profile.id, {
                specialties_data: specialties
            });
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Especialidades salvas com sucesso!");
            }
        });
    };

    const handleSaveExtras = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const dataToSave = {
                video_url: extrasData.video_url || null,
                working_hours: extrasData.working_hours || null,
                languages: extrasData.languages ? extrasData.languages.split(",").map(s => s.trim()).filter(Boolean) : [],
                target_audience: extrasData.target_audience ? extrasData.target_audience.split(",").map(s => s.trim()).filter(Boolean) : [],
                methodologies: extrasData.methodologies ? extrasData.methodologies.split(",").map(s => s.trim()).filter(Boolean) : [],
                certifications: certifications,
                pricing: pricing,
            };
            const result = await updateProfile(profile.id, dataToSave);
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Informações extras salvas com sucesso!");
            }
        });
    };

    const handleSaveSocialLinks = () => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const result = await updateProfile(profile.id, {
                social_links: socialLinks
            });
            if (result.error) {
                setError(result.error);
            } else {
                showSuccess("Redes sociais salvas com sucesso!");
            }
        });
    };

    return {
        // Estados de UI
        isPending,
        activeTab,
        setActiveTab,
        success,
        error,
        setSuccess,

        // Estados de formulário
        profileImageUrl,
        setProfileImageUrl,
        logoUrl,
        setLogoUrl,
        profileData,
        setProfileData,
        attendanceData,
        setAttendanceData,
        showAdvanced,
        setShowAdvanced,
        themeData,
        setThemeData,
        seoData,
        setSeoData,
        specialties,
        setSpecialties,
        isPublished,
        extrasData,
        setExtrasData,
        certifications,
        setCertifications,
        pricing,
        setPricing,
        socialLinks,
        setSocialLinks,

        // Handlers
        handleSaveProfile,
        handleSaveAttendance,
        handleSaveTheme,
        handleSaveSeo,
        handleTogglePublish,
        handleSaveSpecialties,
        handleSaveExtras,
        handleSaveSocialLinks,

        // IDs
        profileId: profile.id,
        siteId: site.id,
        subdomain: site.subdomain,
    };
}

export type UseSiteEditorReturn = ReturnType<typeof useSiteEditor>;
