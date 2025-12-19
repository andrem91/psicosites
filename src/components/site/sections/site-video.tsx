"use client";

import { SiteProfile } from "@/types/site-types";

interface SiteVideoSectionProps {
    profile: SiteProfile;
    primaryColor: string;
}

/**
 * Seção de Vídeo de Apresentação
 * Suporta YouTube e Vimeo
 * Só aparece se video_url estiver preenchido
 */
export function SiteVideoSection({ profile, primaryColor }: SiteVideoSectionProps) {
    if (!profile.video_url) return null;

    // Detectar e converter URL para embed
    const getEmbedUrl = (url: string): string | null => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Vimeo
        const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return null;
    };

    const embedUrl = getEmbedUrl(profile.video_url);
    if (!embedUrl) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <h2
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: primaryColor }}
                >
                    🎬 Conheça meu trabalho
                </h2>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
                    <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Vídeo de apresentação"
                    />
                </div>
            </div>
        </section>
    );
}
