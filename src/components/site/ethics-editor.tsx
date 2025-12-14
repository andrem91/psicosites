"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface EthicsEditorProps {
    showEthics: boolean;
    ethicsContent: string;
    showLgpd: boolean;
    onSave: (data: { showEthics: boolean; ethicsContent: string; showLgpd: boolean }) => Promise<void>;
}

export function EthicsEditor({ showEthics, ethicsContent, showLgpd, onSave }: EthicsEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [localShowEthics, setLocalShowEthics] = useState(showEthics);
    const [localContent, setLocalContent] = useState(
        ethicsContent ||
        "Ao iniciar o processo terapêutico, meu compromisso é oferecer um espaço seguro, acolhedor e pautado nos princípios éticos da Psicologia. Isso inclui:\n\n• Sigilo absoluto: tudo o que é compartilhado em sessão é confidencial\n• Respeito e acolhimento: cada paciente é único, sem julgamentos\n• Base científica: utilizo métodos validados cientificamente\n• Autonomia do paciente: você participa ativamente das decisões"
    );
    const [localShowLgpd, setLocalShowLgpd] = useState(showLgpd);

    const handleSave = () => {
        startTransition(async () => {
            await onSave({
                showEthics: localShowEthics,
                ethicsContent: localContent,
                showLgpd: localShowLgpd,
            });
        });
    };

    return (
        <div className="space-y-6">
            {/* Seção Compromisso Ético */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h4 className="font-semibold text-gray-900">🤝 Compromisso Ético</h4>
                        <p className="text-sm text-gray-500">
                            Exibir seção sobre seu compromisso ético e valores profissionais
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={localShowEthics}
                            onChange={(e) => setLocalShowEthics(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {localShowEthics && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Texto do Compromisso Ético
                        </label>
                        <textarea
                            value={localContent}
                            onChange={(e) => setLocalContent(e.target.value)}
                            rows={6}
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900"
                            placeholder="Descreva seu compromisso ético..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Dica: Inclua informações sobre sigilo, ética, respeito e sua abordagem profissional.
                        </p>
                    </div>
                )}
            </div>

            {/* Seção LGPD */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-900">🔒 Políticas LGPD</h4>
                        <p className="text-sm text-gray-500">
                            Exibir links para Política de Privacidade e Cookies (geradas automaticamente)
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={localShowLgpd}
                            onChange={(e) => setLocalShowLgpd(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {localShowLgpd && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                            ✅ As políticas de privacidade e cookies serão geradas automaticamente com base nos seus dados.
                        </p>
                        <ul className="text-xs text-green-700 mt-2 list-disc list-inside">
                            <li>Política de Privacidade</li>
                            <li>Política de Cookies</li>
                        </ul>
                    </div>
                )}
            </div>

            <Button onClick={handleSave} disabled={isPending} className="w-full">
                {isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
        </div>
    );
}
