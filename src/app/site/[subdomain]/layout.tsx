import { ReactNode } from "react";

interface SiteLayoutProps {
    children: ReactNode;
    params: Promise<{ subdomain: string }>;
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
    // Layout minimalista para sites públicos
    // Pode ser customizado no futuro com opções do site
    return (
        <>
            {children}
        </>
    );
}
