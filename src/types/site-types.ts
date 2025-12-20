// Tipos compartilhados para os componentes do site dinâmico

export interface SiteProfile {
    full_name: string;
    email?: string;
    whatsapp?: string;
    crp?: string;
    gender?: 'male' | 'female' | 'other' | 'not_specified';
    professional_title?: string;
    specialties?: string[];
    specialties_data?: SiteSpecialty[];
    bio?: string;
    bio_short?: string;
    profile_image_url?: string;
    logo_url?: string;
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
    social_links?: {
        instagram?: string;
        linkedin?: string;
        facebook?: string;
        youtube?: string;
        tiktok?: string;
        twitter?: string;
    };
}

export interface SocialLink {
    network: 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'twitter';
    url: string;
}

export interface SiteSpecialty {
    name: string;
    description?: string;
    icon?: string;
}

export interface SiteFAQ {
    id: string;
    question: string;
    answer: string;
}

export interface SiteTestimonial {
    id: string;
    author_name: string;
    author_initials: string;
    content: string;
    rating: number;
}

export interface SiteTheme {
    primaryColor: string;
    fontPreset?: string;
}

// Props base para todos os componentes de seção
export interface SiteSectionProps {
    primaryColor: string;
}
