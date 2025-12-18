import { SiteSectionProps, SiteSpecialty } from "@/types/site-types";
import { DynamicIcon } from "@/components/ui/icon-picker";

interface SiteSpecialtiesProps extends SiteSectionProps {
    specialties?: string[];
    specialtiesData?: SiteSpecialty[];
}

export function SiteSpecialtiesSection({
    specialties,
    specialtiesData,
    primaryColor
}: SiteSpecialtiesProps) {
    // Se não houver especialidades, não renderizar
    if ((!specialtiesData || specialtiesData.length === 0) &&
        (!specialties || specialties.length === 0)) {
        return null;
    }

    // Usar specialties_data se disponível, senão fallback para specialties
    const items = specialtiesData && specialtiesData.length > 0
        ? specialtiesData
        : (specialties || []).map((name: string) => ({ name, description: "", icon: "heart" }));

    return (
        <section id="especialidades" className="py-20 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <h2
                    className="text-3xl font-bold mb-12 text-center"
                    style={{ color: primaryColor }}
                >
                    Áreas de Atuação
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((specialty: SiteSpecialty, index: number) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: primaryColor + "15" }}
                            >
                                <DynamicIcon
                                    name={specialty.icon || "heart"}
                                    className="w-6 h-6"
                                    style={{ color: primaryColor }}
                                />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {specialty.name}
                            </h3>
                            {specialty.description && (
                                <p className="text-sm text-gray-600">
                                    {specialty.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
