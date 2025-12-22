/**
 * Constantes centralizadas do PsicoSites
 * Evita código duplicado e facilita manutenção
 */

// Cores padrão do tema
export const THEME_DEFAULTS = {
    primaryColor: "#6366f1", // Indigo-500
    secondaryColor: "#a855f7", // Purple-500
} as const;

// Configurações de imagem
export const IMAGE_LIMITS = {
    profile: {
        maxSize: 1024,
        quality: 85,
    },
    logo: {
        maxSize: 512,
        quality: 90,
    },
    blog: {
        maxSize: 1200,
        quality: 85,
    },
} as const;

// Tipos de plano
export type PlanType = "free" | "pro";

// Cores disponíveis para plano Free (3 cores)
export const FREE_COLORS = [
    { name: "Azul Índigo", hex: "#6366f1", feeling: "Confiança, profissionalismo" },
    { name: "Verde Esmeralda", hex: "#10b981", feeling: "Calma, saúde mental" },
    { name: "Roxo Violeta", hex: "#8b5cf6", feeling: "Criatividade, equilíbrio" },
] as const;

// Cores adicionais para plano Pro (+5 cores)
export const PRO_ONLY_COLORS = [
    { name: "Rosa Blush", hex: "#ec4899", feeling: "Acolhimento, feminino" },
    { name: "Terracota", hex: "#f97316", feeling: "Aconchego, moderno" },
    { name: "Teal", hex: "#14b8a6", feeling: "Sofisticação, calma" },
    { name: "Bordô", hex: "#be123c", feeling: "Elegância, intensidade" },
    { name: "Grafite", hex: "#475569", feeling: "Minimalista, sério" },
] as const;

// Todas as cores (Pro)
export const ALL_COLORS = [...FREE_COLORS, ...PRO_ONLY_COLORS] as const;

// Presets de fontes disponíveis
export const FREE_FONTS = [
    { id: "classic", name: "Clássico", heading: "Playfair Display", body: "Inter" },
    { id: "modern", name: "Moderno", heading: "Montserrat", body: "Open Sans" },
] as const;

export const PRO_FONTS = [
    ...FREE_FONTS,
    { id: "elegant", name: "Elegante", heading: "Lora", body: "Source Sans Pro" },
    { id: "warm", name: "Acolhedor", heading: "Merriweather", body: "Nunito" },
    { id: "minimal", name: "Minimalista", heading: "Outfit", body: "Inter" },
] as const;

// Planos disponíveis
export const PLANS = {
    FREE: "free",
    PRO: "pro",
} as const;

// Preço do plano Pro
export const PRO_PRICE = {
    monthly: 47,
    currency: "BRL",
} as const;

// Limites por plano (conforme PLANOS.md)
export const PLAN_LIMITS = {
    free: {
        blogPosts: 3,
        testimonials: 3,
        colors: FREE_COLORS,
        fonts: FREE_FONTS,
        heroVideo: false,
        customDomain: false,
        advancedStats: false,
        badgeStyle: "highlighted" as const, // Badge destacado
    },
    pro: {
        blogPosts: -1, // Ilimitado
        testimonials: -1, // Ilimitado
        colors: ALL_COLORS,
        fonts: PRO_FONTS,
        heroVideo: true,
        customDomain: true,
        advancedStats: true,
        badgeStyle: "discrete" as const, // Badge discreto
    },
} as const;

