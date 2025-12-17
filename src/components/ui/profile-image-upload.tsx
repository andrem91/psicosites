"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
    currentImage?: string;
    profileId: string;
    onUpload: (url: string) => void;
}

export function ProfileImageUpload({
    currentImage,
    profileId,
    onUpload,
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo
        if (!file.type.startsWith("image/")) {
            setError("Por favor, selecione uma imagem");
            return;
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 5MB");
            return;
        }

        setError(null);
        setIsUploading(true);

        // Preview local
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload para Supabase
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("profileId", profileId);

            const response = await fetch("/api/upload-profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao fazer upload");
            }

            onUpload(data.url);
        } catch {
            setError("Erro ao fazer upload. Tente novamente.");
            setPreviewUrl(currentImage || null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
                <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Foto de perfil"
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                                className="w-10 h-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Loading overlay */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Botões e Explicação */}
            <div className="flex-1">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    ref={inputRef}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                >
                    {previewUrl ? "Alterar foto" : "Adicionar foto"}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                    Sua foto profissional para o site
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG ou GIF. Máximo 5MB.
                </p>
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
        </div>
    );
}
