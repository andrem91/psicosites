"use client";

import Image from "next/image";
import { SiteProfile, SiteSectionProps } from "@/types/site-types";
import { sanitizeHtml } from "@/lib/sanitize";
import { ScrollLink } from "@/components/ui/scroll-link";

interface SiteHeroProps extends SiteSectionProps {
    profile: SiteProfile;
}

// Helper para obter nomenclatura profissional baseada no gênero
function getProfessionalLabel(profile: SiteProfile): string {
    // Se tem título profissional customizado, usar ele
    if (profile?.professional_title) return profile.professional_title;

    // Baseado no gênero
    switch (profile?.gender) {
        case 'male': return 'Psicólogo';
        case 'female': return 'Psicóloga';
        default: return 'Profissional de Psicologia';
    }
}

export function SiteHeroSection({ profile, primaryColor }: SiteHeroProps) {
    const professionalLabel = getProfessionalLabel(profile);

    return (
        <section id="inicio" className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
            {/* Fundo limpo */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

            {/* Conteúdo */}
            <div className="relative max-w-7xl mx-auto px-4 py-16 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Lado Direito - Imagem */}
                    <div className="order-2 lg:order-2 flex justify-center lg:justify-end animate-slide-right delay-300">
                        {profile?.profile_image_url ? (
                            <div className="relative">
                                {/* Sombra decorativa */}
                                <div
                                    className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                                    style={{ backgroundColor: primaryColor }}
                                />
                                <div className="relative w-80 h-80 lg:w-[512px] lg:h-[512px]">
                                    <Image
                                        src={profile.profile_image_url}
                                        alt={profile.full_name}
                                        fill
                                        className="object-cover rounded-3xl shadow-2xl"
                                        sizes="(max-width: 1024px) 320px, 512px"
                                        priority
                                    />
                                </div>
                                {/* Detalhe decorativo */}
                                <div
                                    className="absolute -bottom-3 -left-3 w-24 h-24 rounded-2xl -z-10"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </div>
                        ) : (
                            <div
                                className="w-80 h-80 lg:w-[512px] lg:h-[512px] rounded-3xl flex items-center justify-center"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Lado Esquerdo - Informações */}
                    <div className="order-1 lg:order-1 text-center lg:text-left">
                        {/* Tag de identificação + Badges de modalidade */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6 animate-fade-in-up">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor
                                }}
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                {professionalLabel}
                            </div>

                            {/* Badge Online */}
                            {profile?.online_service && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Online
                                </div>
                            )}

                            {/* Badge Presencial */}
                            {profile?.in_person_service && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Presencial
                                </div>
                            )}
                        </div>

                        {/* Nome - Tipografia responsiva com fonte de título */}
                        <h1
                            className="text-gray-900 mb-4 leading-tight animate-fade-in-up delay-100"
                            style={{
                                fontFamily: 'var(--font-heading, inherit)',
                                fontWeight: 'var(--font-heading-weight, 700)',
                                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                            }}
                        >
                            {profile?.full_name}
                        </h1>

                        {/* CRP */}
                        {profile?.crp && (
                            <p className="text-lg text-gray-500 mb-6">
                                CRP: {profile.crp}
                            </p>
                        )}

                        {/* Frase de apresentação */}
                        {profile?.bio_short && (
                            <div
                                className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl [&_p]:mb-0 animate-fade-in-up delay-200"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.bio_short) }}
                            />
                        )}

                        {/* CTAs */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up delay-300">
                            <ScrollLink
                                to="contato"
                                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Agendar Consulta
                            </ScrollLink>
                            <ScrollLink
                                to="sobre"
                                className="inline-flex items-center gap-2 px-8 py-4 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Conhecer mais
                            </ScrollLink>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decoração de fundo */}
            <div
                className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: primaryColor }}
            />
            <div
                className="absolute bottom-20 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: primaryColor }}
            />
        </section>
    );
}
