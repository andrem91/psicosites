"use client";

import { Instagram } from "lucide-react";

interface FloatingInstagramButtonProps {
    instagramUrl?: string;
    primaryColor: string;
}

/**
 * Botão flutuante do Instagram
 * Similar ao WhatsApp, mas para Instagram
 * Só aparece se instagram_url estiver preenchido
 */
export function FloatingInstagramButton({ instagramUrl, primaryColor }: FloatingInstagramButtonProps) {
    if (!instagramUrl) return null;

    return (
        <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            style={{
                background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}
            aria-label="Siga no Instagram"
        >
            <Instagram className="w-7 h-7 text-white" />
        </a>
    );
}
