"use client";

import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { FONT_PRESETS } from "@/lib/font-presets";
import { UseSiteEditorReturn } from "../hooks/useSiteEditor";

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

interface ThemeTabProps {
    editor: UseSiteEditorReturn;
}

export function ThemeTab({ editor }: ThemeTabProps) {
    const {
        themeData,
        setThemeData,
        profileData,
        attendanceData,
        isPending,
        handleSaveTheme,
    } = editor;

    return (
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

            {/* Seletor de Tipografia */}
            <div className="pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 Estilo de Tipografia
                </label>
                <p className="text-sm text-gray-500 mb-4">
                    Escolha uma combinação de fontes para títulos e textos
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.values(FONT_PRESETS).map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                                setThemeData({ ...themeData, fontPreset: preset.id })
                            }
                            className={`p-4 rounded-xl border-2 text-left transition-all ${themeData.fontPreset === preset.id
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className="mb-2">
                                <span
                                    className="text-2xl text-gray-900"
                                    style={{ fontFamily: `"${preset.headingFont}", serif` }}
                                >
                                    Aa
                                </span>
                            </div>
                            <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                            <p className="text-xs text-gray-500">{preset.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {preset.headingFont} + {preset.bodyFont}
                            </p>
                        </button>
                    ))}
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
    );
}
