"use client";

import { SiteProfile } from "@/types/site-types";
import { GraduationCap } from "lucide-react";

interface SiteCertificationsSectionProps {
    profile: SiteProfile;
    primaryColor: string;
}

/**
 * Seção de Certificações e Formações
 * Só aparece se certifications tiver itens
 */
export function SiteCertificationsSection({ profile, primaryColor }: SiteCertificationsSectionProps) {
    if (!profile.certifications || profile.certifications.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: primaryColor }}
                >
                    🎓 Formação e Certificações
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.certifications.map((cert, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${primaryColor}20` }}
                            >
                                <GraduationCap
                                    className="w-6 h-6"
                                    style={{ color: primaryColor }}
                                />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {cert.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {cert.institution}
                                {cert.year && ` • ${cert.year}`}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
