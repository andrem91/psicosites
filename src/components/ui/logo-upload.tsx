"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
    currentLogo?: string;
    profileId: string;
    onUpload: (url: string) => void;
}

export function LogoUpload({
    currentLogo,
    profileId,
    onUpload,
}: LogoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo || null);
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

        // Validar tamanho (max 2MB para logo)
        if (file.size > 2 * 1024 * 1024) {
            setError("A logo deve ter no máximo 2MB");
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
            formData.append("type", "logo");

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
            setPreviewUrl(currentLogo || null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            {/* Logo Preview */}
            <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Logo"
                            fill
                            className="object-contain"
                            sizes="80px"
                        />
                    ) : (
                        <div className="text-gray-400">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Loading overlay */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Botões */}
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
                    {previewUrl ? "Alterar logo" : "Adicionar logo"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                    PNG ou SVG. Máximo 2MB. Fundo transparente recomendado.
                </p>
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
        </div>
    );
}
