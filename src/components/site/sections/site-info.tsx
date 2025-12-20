"use client";

import { SiteProfile } from "@/types/site-types";
import { Clock, Globe, Users, Brain, LucideIcon } from "lucide-react";

interface SiteInfoSectionProps {
    profile: SiteProfile;
    primaryColor: string;
}

// InfoCard declarado fora do componente para evitar recriação durante render
interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    items: string[] | string;
    primaryColor: string;
}

function InfoCard({ icon: Icon, title, items, primaryColor }: InfoCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full sm:w-64">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${primaryColor}20` }}
            >
                <Icon className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            {Array.isArray(items) ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{
                                backgroundColor: `${primaryColor}10`,
                                color: primaryColor
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">{items}</p>
            )}
        </div>
    );
}

/**
 * Seção de Informações Adicionais
 * Exibe: Horários, Idiomas, Público-alvo, Metodologias
 * Cada item só aparece se estiver preenchido
 */
export function SiteInfoSection({ profile, primaryColor }: SiteInfoSectionProps) {
    const hasWorkingHours = !!profile.working_hours;
    const hasLanguages = profile.languages && profile.languages.length > 0;
    const hasTargetAudience = profile.target_audience && profile.target_audience.length > 0;
    const hasMethodologies = profile.methodologies && profile.methodologies.length > 0;

    // Se nenhum campo estiver preenchido, não renderiza nada
    if (!hasWorkingHours && !hasLanguages && !hasTargetAudience && !hasMethodologies) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: primaryColor }}
                >
                    Informações do Atendimento
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {hasWorkingHours && (
                        <InfoCard
                            icon={Clock}
                            title="Horários"
                            items={profile.working_hours!}
                            primaryColor={primaryColor}
                        />
                    )}
                    {hasLanguages && (
                        <InfoCard
                            icon={Globe}
                            title="Idiomas"
                            items={profile.languages!}
                            primaryColor={primaryColor}
                        />
                    )}
                    {hasTargetAudience && (
                        <InfoCard
                            icon={Users}
                            title="Público-alvo"
                            items={profile.target_audience!}
                            primaryColor={primaryColor}
                        />
                    )}
                    {hasMethodologies && (
                        <InfoCard
                            icon={Brain}
                            title="Metodologias"
                            items={profile.methodologies!}
                            primaryColor={primaryColor}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
