"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import { LogoUpload } from "@/components/ui/logo-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FAQEditor } from "@/components/site/faq-editor";
import { EthicsEditor } from "@/components/site/ethics-editor";
import { TestimonialsEditor } from "@/components/site/testimonials-editor";
import { SpecialtyEditor } from "@/components/site/specialty-editor";
import { Specialty } from "@/types/specialty";
import { updateProfile, updateSiteConfig, togglePublishSite } from "./actions";

// Função para remover tags HTML de uma string
function stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
}

// Paleta de cores adequada para psicólogos
const PRESET_COLORS = [
    { name: "Azul Serenidade", value: "#5B8FB9" },
    { name: "Verde Sábio", value: "#6B9080" },
    { name: "Lavanda", value: "#9B8AB8" },
    { name: "Rosa Antigo", value: "#C4A484" },
    { name: "Terracota", value: "#B4846C" },
    { name: "Azul Petróleo", value: "#2C6975" },
    { name: "Vinho Suave", value: "#8B5A5A" },
    { name: "Cinza Grafite", value: "#545B64" },
];

interface SiteEditorProps {
    profile: {
        id: string;
        full_name: string;
        crp: string;
        whatsapp: string;
        bio: string;
        bio_short?: string;
        specialties: string[];
        specialties_data?: Specialty[];
        profile_image_url?: string;
        logo_url?: string;
        online_service?: boolean;
        in_person_service?: boolean;
        street?: string;
        street_number?: string;
        neighborhood?: string;
        complement?: string;
        city?: string;
        state?: string;
        zip_code?: string;
        google_maps_embed?: string;
    };
    site: {
        id: string;
        subdomain: string;
        site_title: string;
        meta_description: string;
        is_published: boolean;
        theme_config: {
            primaryColor: string;
            backgroundColor: string;
            fontFamily: string;
        };
        show_ethics_section?: boolean;
        ethics_content?: string;
        show_lgpd_section?: boolean;
    };
}

export function SiteEditor({ profile, site }: SiteEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<"profile" | "attendance" | "specialties" | "theme" | "seo" | "ethics" | "faq" | "testimonials">("profile");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [profileImageUrl, setProfileImageUrl] = useState(profile.profile_image_url || "");
    const [logoUrl, setLogoUrl] = useState(profile.logo_url || "");
    const [profileData, setProfileData] = useState({
        full_name: profile.full_name || "",
        crp: profile.crp || "",
        whatsapp: profile.whatsapp || "",
        bio: profile.bio || "",
        bio_short: profile.bio_short || "",
    });

    const [attendanceData, setAttendanceData] = useState({
        online_service: profile.online_service ?? true,
        in_person_service: profile.in_person_service ?? false,
        street: profile.street || "",
        street_number: profile.street_number || "",
        neighborhood: profile.neighborhood || "",
        complement: profile.complement || "",
        city: profile.city || "",
        state: profile.state || "",
        zip_code: profile.zip_code || "",
        google_maps_embed: profile.google_maps_embed || "",
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const [themeData, setThemeData] = useState({
        primaryColor: site.theme_config?.primaryColor || "#5B8FB9",
    });

    const [seoData, setSeoData] = useState({
        site_title: site.site_title || "",
        meta_description: stripHtml(site.meta_description || ""),
    });

    // State para especialidades (agora com tipo Specialty[])
    const [specialties, setSpecialties] = useState<Specialty[]>(
        // Converter formato antigo se necessário
        (profile.specialties_data as Specialty[]) ||
        (profile.specialties || []).map((name: string) => ({ name, description: "", icon: "heart" }))
    );

    const [isPublished, setIsPublished] = useState(site.is_published);

    // Salvar perfil
    const handleSaveProfile = () => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await updateProfile(profile.id, profileData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Perfil salvo com sucesso!");
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    };

    // Salvar atendimento
    const handleSaveAttendance = () => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await updateProfile(profile.id, attendanceData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Modalidades de atendimento salvas!");
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    };

    // Salvar tema
    const handleSaveTheme = () => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await updateSiteConfig(site.id, {
                theme_config: {
                    primaryColor: themeData.primaryColor,
                    backgroundColor: "#ffffff",
                    fontFamily: "Inter",
                },
            });
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Tema salvo com sucesso!");
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    };

    // Salvar SEO
    const handleSaveSeo = () => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await updateSiteConfig(site.id, seoData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Configurações de SEO salvas!");
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    };

    // Toggle publicação
    const handleTogglePublish = () => {
        startTransition(async () => {
            const result = await togglePublishSite(site.id, !isPublished);
            if (result.error) {
                setError(result.error);
            } else {
                setIsPublished(!isPublished);
                setSuccess(isPublished ? "Site despublicado" : "Site publicado com sucesso!");
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Status messages */}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {success}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* URL e Status de publicação */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Endereço do seu site:</p>
                        <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${site.subdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            {site.subdomain}.psibuilder.com.br
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${isPublished ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                                    }`}
                            />
                            <span className="text-sm text-gray-600">
                                {isPublished ? "Publicado" : "Rascunho"}
                            </span>
                        </div>
                        <Button
                            variant={isPublished ? "outline" : "default"}
                            size="sm"
                            onClick={handleTogglePublish}
                            isLoading={isPending}
                        >
                            {isPublished ? "Despublicar" : "Publicar"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {[
                        { id: "profile", label: "Perfil" },
                        { id: "specialties", label: "Especialidades" },
                        { id: "attendance", label: "Atendimento" },
                        { id: "theme", label: "Tema" },
                        { id: "seo", label: "SEO" },
                        { id: "ethics", label: "Ética/LGPD" },
                        { id: "faq", label: "FAQ" },
                        { id: "testimonials", label: "Depoimentos" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Tab Perfil */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            {/* Foto de perfil */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Foto de perfil
                                </label>
                                <ProfileImageUpload
                                    currentImage={profileImageUrl}
                                    profileId={profile.id}
                                    onUpload={(url) => {
                                        setProfileImageUrl(url);
                                        setSuccess("Foto atualizada com sucesso!");
                                        setTimeout(() => setSuccess(null), 3000);
                                    }}
                                />
                            </div>

                            {/* Logo do site */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Logo do site (header)
                                </label>
                                <LogoUpload
                                    currentLogo={logoUrl}
                                    profileId={profile.id}
                                    onUpload={(url) => {
                                        setLogoUrl(url);
                                        setSuccess("Logo atualizada com sucesso!");
                                        setTimeout(() => setSuccess(null), 3000);
                                    }}
                                />
                            </div>

                            <Input
                                label="Nome completo"
                                value={profileData.full_name}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, full_name: e.target.value })
                                }
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="CRP"
                                    value={profileData.crp}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, crp: e.target.value })
                                    }
                                />
                                <Input
                                    label="WhatsApp"
                                    value={profileData.whatsapp}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, whatsapp: e.target.value })
                                    }
                                />
                            </div>

                            {/* Frase de apresentação */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Frase de apresentação
                                    <span className="text-gray-400 font-normal ml-2">(exibida no topo do site)</span>
                                </label>
                                <Textarea
                                    className="resize-none text-gray-900"
                                    rows={2}
                                    placeholder="Ex: Psicóloga clínica especializada em ansiedade e desenvolvimento pessoal"
                                    value={profileData.bio_short}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, bio_short: e.target.value })
                                    }
                                    maxLength={200}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {profileData.bio_short.length}/200 caracteres
                                </p>
                            </div>

                            {/* Sobre mim completo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sobre mim
                                    <span className="text-gray-400 font-normal ml-2">(texto completo com formatação)</span>
                                </label>
                                <RichTextEditor
                                    content={profileData.bio}
                                    onChange={(html) =>
                                        setProfileData({ ...profileData, bio: html })
                                    }
                                    placeholder="Conte mais sobre sua formação, experiência, abordagem terapêutica..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} isLoading={isPending}>
                                    Salvar Perfil
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tab Especialidades */}
                    {activeTab === "specialties" && (
                        <SpecialtyEditor
                            specialties={specialties}
                            onChange={setSpecialties}
                            primaryColor={themeData.primaryColor}
                            isSaving={isPending}
                            onSave={() => {
                                startTransition(async () => {
                                    setError(null);
                                    const result = await updateProfile(profile.id, {
                                        specialties_data: specialties
                                    });
                                    if (result.error) {
                                        setError(result.error);
                                    } else {
                                        setSuccess("Especialidades salvas com sucesso!");
                                        setTimeout(() => setSuccess(null), 3000);
                                    }
                                });
                            }}
                        />
                    )}

                    {/* Tab Atendimento */}
                    {activeTab === "attendance" && (
                        <div className="space-y-6">
                            {/* Modalidades */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Modalidades de atendimento
                                </label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
                                        style={{
                                            borderColor: attendanceData.online_service ? "#5B8FB9" : "#e5e7eb",
                                            backgroundColor: attendanceData.online_service ? "#5B8FB910" : "transparent"
                                        }}
                                    >
                                        <Checkbox
                                            id="online_service"
                                            checked={attendanceData.online_service}
                                            onCheckedChange={(checked) =>
                                                setAttendanceData({ ...attendanceData, online_service: !!checked })
                                            }
                                        />
                                        <div>
                                            <span className="font-medium text-gray-900">Online</span>
                                            <p className="text-sm text-gray-500">Atendimento por videochamada</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
                                        style={{
                                            borderColor: attendanceData.in_person_service ? "#5B8FB9" : "#e5e7eb",
                                            backgroundColor: attendanceData.in_person_service ? "#5B8FB910" : "transparent"
                                        }}
                                    >
                                        <Checkbox
                                            id="in_person_service"
                                            checked={attendanceData.in_person_service}
                                            onCheckedChange={(checked) =>
                                                setAttendanceData({ ...attendanceData, in_person_service: !!checked })
                                            }
                                        />
                                        <div>
                                            <span className="font-medium text-gray-900">Presencial</span>
                                            <p className="text-sm text-gray-500">Atendimento no consultório</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Endereço (apenas se presencial) */}
                            {attendanceData.in_person_service && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-medium text-gray-900">Endereço do consultório</h4>

                                    <Input
                                        label="CEP"
                                        placeholder="00000-000"
                                        value={attendanceData.zip_code}
                                        onChange={(e) =>
                                            setAttendanceData({ ...attendanceData, zip_code: e.target.value })
                                        }
                                    />

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Rua/Avenida"
                                                placeholder="Av. Paulista"
                                                value={attendanceData.street}
                                                onChange={(e) =>
                                                    setAttendanceData({ ...attendanceData, street: e.target.value })
                                                }
                                            />
                                        </div>
                                        <Input
                                            label="Número"
                                            placeholder="1000"
                                            value={attendanceData.street_number}
                                            onChange={(e) =>
                                                setAttendanceData({ ...attendanceData, street_number: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            label="Bairro"
                                            placeholder="Bela Vista"
                                            value={attendanceData.neighborhood}
                                            onChange={(e) =>
                                                setAttendanceData({ ...attendanceData, neighborhood: e.target.value })
                                            }
                                        />
                                        <Input
                                            label="Complemento"
                                            placeholder="Sala 1010"
                                            value={attendanceData.complement}
                                            onChange={(e) =>
                                                setAttendanceData({ ...attendanceData, complement: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            label="Cidade"
                                            value={attendanceData.city}
                                            onChange={(e) =>
                                                setAttendanceData({ ...attendanceData, city: e.target.value })
                                            }
                                        />
                                        <Input
                                            label="Estado"
                                            placeholder="SP"
                                            value={attendanceData.state}
                                            onChange={(e) =>
                                                setAttendanceData({ ...attendanceData, state: e.target.value })
                                            }
                                        />
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        📍 O endereço será exibido no site com um mapa do Google Maps
                                    </p>

                                    {/* Configurações avançadas */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            <svg
                                                className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            Configurações avançadas
                                        </button>

                                        {showAdvanced && (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Embed personalizado do Google Maps
                                                    </label>
                                                    <Textarea
                                                        className="font-mono resize-none text-gray-900"
                                                        rows={3}
                                                        placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                                                        value={attendanceData.google_maps_embed}
                                                        onChange={(e) =>
                                                            setAttendanceData({ ...attendanceData, google_maps_embed: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Tutorial */}
                                                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                                                    <h5 className="font-medium text-blue-800 mb-2">📘 Como obter o código embed:</h5>
                                                    <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                                                        <li>Acesse <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
                                                        <li>Pesquise pelo seu endereço</li>
                                                        <li>Clique no botão <strong>Compartilhar</strong></li>
                                                        <li>Selecione a aba <strong>Incorporar um mapa</strong></li>
                                                        <li>Copie o código HTML <code className="bg-blue-100 px-1 rounded">&lt;iframe&gt;...&lt;/iframe&gt;</code></li>
                                                        <li>Cole aqui no campo acima</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button onClick={handleSaveAttendance} isLoading={isPending}>
                                    Salvar Atendimento
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tab Tema */}
                    {activeTab === "theme" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cor principal do site
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Cores selecionadas para transmitir calma e profissionalismo
                                </p>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() =>
                                                setThemeData({ ...themeData, primaryColor: color.value })
                                            }
                                            className={`w-12 h-12 rounded-xl transition-all ${themeData.primaryColor === color.value
                                                ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                                                : "hover:scale-105"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ou escolha uma cor customizada:
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={themeData.primaryColor}
                                        onChange={(e) =>
                                            setThemeData({ ...themeData, primaryColor: e.target.value })
                                        }
                                        className="w-12 h-12 rounded-lg cursor-pointer"
                                    />
                                    <Input
                                        value={themeData.primaryColor}
                                        onChange={(e) =>
                                            setThemeData({ ...themeData, primaryColor: e.target.value })
                                        }
                                        className="w-32"
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Preview:
                                </label>
                                <div
                                    className="rounded-2xl p-6 text-white"
                                    style={{ backgroundColor: themeData.primaryColor }}
                                >
                                    <h3 className="text-xl font-bold mb-2">{profileData.full_name || "Seu Nome"}</h3>
                                    <p className="opacity-90">CRP: {profileData.crp || "00/00000"}</p>
                                    <div className="flex gap-2 mt-3">
                                        {attendanceData.online_service && (
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🖥️ Online</span>
                                        )}
                                        {attendanceData.in_person_service && (
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🏢 Presencial</span>
                                        )}
                                    </div>
                                    <button className="mt-4 px-4 py-2 bg-white rounded-full text-sm font-medium"
                                        style={{ color: themeData.primaryColor }}
                                    >
                                        Agendar Consulta
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveTheme} isLoading={isPending}>
                                    Salvar Tema
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tab SEO */}
                    {activeTab === "seo" && (
                        <div className="space-y-6">
                            <Input
                                label="Título do site (SEO)"
                                placeholder="Ex: Dr. João Silva - Psicólogo"
                                value={seoData.site_title}
                                onChange={(e) =>
                                    setSeoData({ ...seoData, site_title: e.target.value })
                                }
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição para buscadores (Meta Description)
                                </label>
                                <Textarea
                                    className="resize-none text-gray-900"
                                    rows={3}
                                    placeholder="Descreva seu trabalho em 1-2 frases. Isso aparece nos resultados do Google."
                                    value={seoData.meta_description}
                                    onChange={(e) =>
                                        setSeoData({ ...seoData, meta_description: e.target.value })
                                    }
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {seoData.meta_description.length}/160 caracteres recomendados
                                </p>
                            </div>

                            {/* Preview Google */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Preview no Google:
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-blue-700 text-lg hover:underline cursor-pointer">
                                        {seoData.site_title || "Título do seu site"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        {site.subdomain}.psibuilder.com.br
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {seoData.meta_description || "Descrição do seu site aparecerá aqui..."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveSeo} isLoading={isPending}>
                                    Salvar SEO
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tab Ética/LGPD */}
                    {activeTab === "ethics" && (
                        <EthicsEditor
                            showEthics={site.show_ethics_section ?? true}
                            ethicsContent={site.ethics_content || ""}
                            showLgpd={site.show_lgpd_section ?? true}
                            onSave={async (data) => {
                                try {
                                    const res = await fetch("/api/site/ethics", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(data),
                                    });
                                    if (res.ok) {
                                        setSuccess("Configurações salvas com sucesso!");
                                        setTimeout(() => setSuccess(null), 3000);
                                    } else {
                                        setError("Erro ao salvar configurações");
                                        setTimeout(() => setError(null), 3000);
                                    }
                                } catch {
                                    setError("Erro ao salvar configurações");
                                    setTimeout(() => setError(null), 3000);
                                }
                            }}
                        />
                    )}

                    {/* Tab FAQ */}
                    {activeTab === "faq" && (
                        <FAQEditor siteId={site.id} />
                    )}

                    {/* Tab Depoimentos */}
                    {activeTab === "testimonials" && (
                        <TestimonialsEditor siteId={site.id} />
                    )}
                </div>
            </div>
        </div>
    );
}
