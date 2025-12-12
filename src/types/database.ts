// Tipos base do banco de dados
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// Planos disponíveis
export type PlanType = "free" | "professional" | "authority" | "clinic";

// Status de assinatura
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

// Especialidades pré-definidas
export type Specialty =
    | "ansiedade"
    | "depressao"
    | "luto"
    | "relacionamentos"
    | "stress"
    | "autoestima"
    | "transtornos_alimentares"
    | "tdah"
    | "autismo"
    | "infantil"
    | "adolescentes"
    | "casais"
    | "familiar"
    | "carreira"
    | "outros";

// Abordagens terapêuticas
export type TherapeuticApproach =
    | "tcc"
    | "psicanalise"
    | "humanista"
    | "sistemica"
    | "gestalt"
    | "comportamental"
    | "junguiana"
    | "existencial"
    | "integrativa"
    | "outra";

// Perfil do psicólogo
export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    crp: string;
    crp_verified: boolean;
    photo_url: string | null;
    bio: string | null;
    whatsapp: string;
    email: string;
    specialties: Specialty[];
    approach: TherapeuticApproach;
    approach_description: string | null;
    city: string | null;
    state: string | null;
    online_service: boolean;
    in_person_service: boolean;
    created_at: string;
    updated_at: string;
}

// Configuração do site
export interface SiteConfig {
    id: string;
    profile_id: string;
    subdomain: string;
    custom_domain: string | null;
    domain_verified: boolean;
    theme_id: string;
    primary_color: string;
    secondary_color: string;
    font_family: string;
    hero_headline: string | null;
    hero_subheadline: string | null;
    about_text: string | null;
    show_blog: boolean;
    show_faq: boolean;
    ga_measurement_id: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Assinatura
export interface Subscription {
    id: string;
    user_id: string;
    asaas_customer_id: string | null;
    asaas_subscription_id: string | null;
    plan: PlanType;
    status: SubscriptionStatus;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
}

// Analytics
export interface SiteAnalytics {
    id: string;
    site_id: string;
    date: string;
    page_views: number;
    unique_visitors: number;
    whatsapp_clicks: number;
    created_at: string;
}

// Artigo do blog
export interface BlogPost {
    id: string;
    site_id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

// FAQ Item
export interface FAQItem {
    id: string;
    site_id: string;
    question: string;
    answer: string;
    order: number;
    created_at: string;
}

// Tipo para usuário autenticado com perfil
export interface AuthenticatedUser {
    id: string;
    email: string;
    profile: Profile | null;
    site: SiteConfig | null;
    subscription: Subscription | null;
}
