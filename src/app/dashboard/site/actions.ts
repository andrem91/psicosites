"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Specialty } from "@/types/specialty";

interface ProfileData {
    full_name: string;
    crp: string;
    whatsapp: string;
    bio: string;
    bio_short?: string;
    specialties: string[];
    specialties_data?: Specialty[];
    profile_image_url?: string;
    logo_url?: string;
    online_service?: boolean;
    in_person_service?: boolean;
    // Endereço separado
    street?: string;
    street_number?: string;
    neighborhood?: string;
    complement?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    // Embed personalizado
    google_maps_embed?: string;
    social_links?: {
        instagram?: string;
        linkedin?: string;
        facebook?: string;
        youtube?: string;
        tiktok?: string;
        twitter?: string;
    };
}

interface SiteTheme {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    fontPreset?: string;
}

interface SiteData {
    site_title: string;
    meta_description: string;
    is_published: boolean;
    theme_config: SiteTheme;
}

// Atualizar dados do perfil
export async function updateProfile(profileId: string, data: Partial<ProfileData>) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

    if (error) {
        return { error: "Erro ao salvar perfil. Tente novamente." };
    }

    revalidatePath("/dashboard/site");
    revalidatePath("/site");
    return { success: true };
}

// Atualizar configurações do site
export async function updateSiteConfig(siteId: string, data: Partial<SiteData>) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("sites")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", siteId);

    if (error) {
        return { error: "Erro ao salvar configurações. Tente novamente." };
    }

    revalidatePath("/dashboard/site");
    revalidatePath("/site");
    return { success: true };
}

// Publicar/Despublicar site
export async function togglePublishSite(siteId: string, isPublished: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("sites")
        .update({
            is_published: isPublished,
            updated_at: new Date().toISOString(),
        })
        .eq("id", siteId);

    if (error) {
        return { error: "Erro ao alterar status de publicação." };
    }

    revalidatePath("/dashboard/site");
    return { success: true };
}
