"use client";

import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import { LogoUpload } from "@/components/ui/logo-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { UseSiteEditorReturn } from "../hooks/useSiteEditor";

interface ProfileTabProps {
    editor: UseSiteEditorReturn;
}

export function ProfileTab({ editor }: ProfileTabProps) {
    const {
        profileImageUrl,
        setProfileImageUrl,
        logoUrl,
        setLogoUrl,
        profileData,
        setProfileData,
        profileId,
        isPending,
        handleSaveProfile,
        setSuccess,
    } = editor;

    return (
        <div className="space-y-6">
            {/* Foto de perfil */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Foto de perfil
                </label>
                <ProfileImageUpload
                    currentImage={profileImageUrl}
                    profileId={profileId}
                    onUpload={(url: string) => {
                        setProfileImageUrl(url);
                        setSuccess("Foto atualizada com sucesso!");
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
                    profileId={profileId}
                    onUpload={(url: string) => {
                        setLogoUrl(url);
                        setSuccess("Logo atualizada com sucesso!");
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
    );
}
