"use client";

import { SiteProfile } from "@/types/site-types";

interface SitePricingSectionProps {
    profile: SiteProfile;
    primaryColor: string;
}

/**
 * Seção de Preços e Valores
 * Só aparece se pricing tiver itens
 */
export function SitePricingSection({ profile, primaryColor }: SitePricingSectionProps) {
    if (!profile.pricing || profile.pricing.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <h2
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: primaryColor }}
                >
                    💰 Valores
                </h2>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr
                                className="text-white"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <th className="text-left px-6 py-4 font-semibold">Serviço</th>
                                <th className="text-center px-6 py-4 font-semibold">Duração</th>
                                <th className="text-right px-6 py-4 font-semibold">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.pricing.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.service}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        {item.duration || "-"}
                                    </td>
                                    <td
                                        className="px-6 py-4 text-right font-bold"
                                        style={{ color: primaryColor }}
                                    >
                                        R$ {item.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                    * Valores sujeitos a alteração sem aviso prévio
                </p>
            </div>
        </section>
    );
}
