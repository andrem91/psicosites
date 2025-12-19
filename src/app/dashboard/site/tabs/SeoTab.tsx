"use client";

import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { UseSiteEditorReturn } from "../hooks/useSiteEditor";

interface SeoTabProps {
    editor: UseSiteEditorReturn;
}

export function SeoTab({ editor }: SeoTabProps) {
    const {
        seoData,
        setSeoData,
        isPending,
        handleSaveSeo,
    } = editor;

    return (
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
                    maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {seoData.meta_description.length}/160 caracteres
                </p>
            </div>

            {/* Preview Google */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Preview no Google:</p>
                <div className="font-sans">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seoData.site_title || "Título do seu site"}
                    </p>
                    <p className="text-green-700 text-sm">
                        psicosites.com.br › site
                    </p>
                    <p className="text-sm text-gray-600">
                        {seoData.meta_description || "Descrição que aparecerá nos resultados de busca..."}
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSaveSeo} isLoading={isPending}>
                    Salvar SEO
                </Button>
            </div>
        </div>
    );
}
