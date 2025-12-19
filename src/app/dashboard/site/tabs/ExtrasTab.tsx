"use client";

import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { UseSiteEditorReturn } from "../hooks/useSiteEditor";

interface ExtrasTabProps {
    editor: UseSiteEditorReturn;
}

export function ExtrasTab({ editor }: ExtrasTabProps) {
    const {
        extrasData,
        setExtrasData,
        certifications,
        setCertifications,
        pricing,
        setPricing,
        isPending,
        handleSaveExtras,
    } = editor;

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                💡 Estas informações são <strong>opcionais</strong>. Campos vazios não aparecerão no seu site público.
            </div>

            {/* Vídeo de apresentação */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎬 Vídeo de Apresentação</h3>
                <Input
                    label="URL do vídeo (YouTube ou Vimeo)"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={extrasData.video_url}
                    onChange={(e) => setExtrasData({ ...extrasData, video_url: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">Cole o link do seu vídeo de apresentação profissional</p>
            </div>

            {/* Horários de atendimento */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Horários de Atendimento</h3>
                <Textarea
                    className="resize-none text-gray-900"
                    rows={2}
                    placeholder="Ex: Seg a Sex, 8h às 20h | Sábados, 8h às 12h"
                    value={extrasData.working_hours}
                    onChange={(e) => setExtrasData({ ...extrasData, working_hours: e.target.value })}
                />
            </div>

            {/* Instagram URL */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Instagram</h3>
                <Input
                    label="Link do seu Instagram"
                    placeholder="https://instagram.com/seuusuario"
                    value={extrasData.instagram_url}
                    onChange={(e) => setExtrasData({ ...extrasData, instagram_url: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">Um botão flutuante do Instagram aparecerá no seu site</p>
            </div>

            {/* Idiomas */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Idiomas de Atendimento</h3>
                <Input
                    label="Idiomas (separados por vírgula)"
                    placeholder="Português, Inglês, Espanhol"
                    value={extrasData.languages}
                    onChange={(e) => setExtrasData({ ...extrasData, languages: e.target.value })}
                />
            </div>

            {/* Público-alvo */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Público-Alvo</h3>
                <Input
                    label="Públicos atendidos (separados por vírgula)"
                    placeholder="Adultos, Adolescentes, Casais, Idosos"
                    value={extrasData.target_audience}
                    onChange={(e) => setExtrasData({ ...extrasData, target_audience: e.target.value })}
                />
            </div>

            {/* Metodologias */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Metodologias e Abordagens</h3>
                <Input
                    label="Metodologias (separadas por vírgula)"
                    placeholder="TCC, Psicanálise, Gestalt, EMDR, Terapia Sistêmica"
                    value={extrasData.methodologies}
                    onChange={(e) => setExtrasData({ ...extrasData, methodologies: e.target.value })}
                />
            </div>

            {/* Certificações */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Certificações e Formações</h3>
                <div className="space-y-4">
                    {certifications.map((cert, index) => (
                        <div key={index} className="flex gap-2 items-start bg-gray-50 p-4 rounded-xl">
                            <div className="flex-1 grid md:grid-cols-3 gap-2">
                                <Input
                                    placeholder="Título"
                                    value={cert.title || ""}
                                    onChange={(e) => {
                                        const updated = [...certifications];
                                        updated[index] = { ...cert, title: e.target.value };
                                        setCertifications(updated);
                                    }}
                                />
                                <Input
                                    placeholder="Instituição"
                                    value={cert.institution || ""}
                                    onChange={(e) => {
                                        const updated = [...certifications];
                                        updated[index] = { ...cert, institution: e.target.value };
                                        setCertifications(updated);
                                    }}
                                />
                                <Input
                                    placeholder="Ano"
                                    value={cert.year || ""}
                                    onChange={(e) => {
                                        const updated = [...certifications];
                                        updated[index] = { ...cert, year: e.target.value };
                                        setCertifications(updated);
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                            >
                                ❌
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCertifications([...certifications, { title: "", institution: "", year: "" }])}
                    >
                        + Adicionar Certificação
                    </Button>
                </div>
            </div>

            {/* Preços */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Preços e Valores</h3>
                <div className="space-y-4">
                    {pricing.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start bg-gray-50 p-4 rounded-xl">
                            <div className="flex-1 grid md:grid-cols-3 gap-2">
                                <Input
                                    placeholder="Serviço (ex: Sessão Individual)"
                                    value={item.service || ""}
                                    onChange={(e) => {
                                        const updated = [...pricing];
                                        updated[index] = { ...item, service: e.target.value };
                                        setPricing(updated);
                                    }}
                                />
                                <Input
                                    placeholder="Preço (ex: 200)"
                                    value={item.price || ""}
                                    onChange={(e) => {
                                        const updated = [...pricing];
                                        updated[index] = { ...item, price: e.target.value };
                                        setPricing(updated);
                                    }}
                                />
                                <Input
                                    placeholder="Duração (ex: 50min)"
                                    value={item.duration || ""}
                                    onChange={(e) => {
                                        const updated = [...pricing];
                                        updated[index] = { ...item, duration: e.target.value };
                                        setPricing(updated);
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPricing(pricing.filter((_, i) => i !== index))}
                            >
                                ❌
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPricing([...pricing, { service: "", price: "", duration: "" }])}
                    >
                        + Adicionar Preço
                    </Button>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSaveExtras} isLoading={isPending}>
                    Salvar Informações Extras
                </Button>
            </div>
        </div>
    );
}
