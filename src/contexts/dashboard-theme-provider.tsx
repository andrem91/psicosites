"use client";

import { createContext, useContext, ReactNode } from "react";

export interface DashboardTheme {
    primaryColor: string;
    logoUrl?: string;
    siteName?: string;
    subdomain?: string;
    gender?: "male" | "female" | "other";
}

interface DashboardThemeContextType {
    theme: DashboardTheme;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

const DEFAULT_THEME: DashboardTheme = {
    primaryColor: "#6366f1", // Indigo padrão
};

interface DashboardThemeProviderProps {
    children: ReactNode;
    theme?: DashboardTheme;
}

export function DashboardThemeProvider({ children, theme = DEFAULT_THEME }: DashboardThemeProviderProps) {
    return (
        <DashboardThemeContext.Provider value={{ theme }}>
            {/* Aplica CSS variables para uso global */}
            <div
                style={{
                    '--dashboard-primary': theme.primaryColor,
                    '--dashboard-primary-light': `${theme.primaryColor}20`,
                    '--dashboard-primary-hover': `${theme.primaryColor}15`,
                } as React.CSSProperties}
            >
                {children}
            </div>
        </DashboardThemeContext.Provider>
    );
}

export function useDashboardTheme() {
    const context = useContext(DashboardThemeContext);
    if (context === undefined) {
        // Retorna tema padrão se não estiver dentro do provider
        return { theme: DEFAULT_THEME };
    }
    return context;
}

/**
 * Helper para saudação personalizada
 * Retorna "Bom dia", "Boa tarde" ou "Boa noite" baseado no horário
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
}

/**
 * Monta a saudação completa com nome
 * Ex: "Bom dia, Maria!"
 */
export function getPersonalizedGreeting(name: string, _gender?: string): string {
    const greeting = getGreeting();
    const firstName = name.split(" ")[0];
    return `${greeting}, ${firstName}!`;
}
