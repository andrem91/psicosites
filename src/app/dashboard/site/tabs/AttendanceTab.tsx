"use client";

import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseSiteEditorReturn } from "../hooks/useSiteEditor";

interface AttendanceTabProps {
    editor: UseSiteEditorReturn;
}

export function AttendanceTab({ editor }: AttendanceTabProps) {
    const {
        attendanceData,
        setAttendanceData,
        showAdvanced,
        setShowAdvanced,
        isPending,
        handleSaveAttendance,
    } = editor;

    return (
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
                            <p className="text-sm text-gray-500">Atendimento em consultório</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Endereço do consultório */}
            {attendanceData.in_person_service && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900">Endereço do consultório</h4>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Rua/Avenida"
                            value={attendanceData.street}
                            onChange={(e) =>
                                setAttendanceData({ ...attendanceData, street: e.target.value })
                            }
                        />
                        <Input
                            label="Número"
                            value={attendanceData.street_number}
                            onChange={(e) =>
                                setAttendanceData({ ...attendanceData, street_number: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Bairro"
                            value={attendanceData.neighborhood}
                            onChange={(e) =>
                                setAttendanceData({ ...attendanceData, neighborhood: e.target.value })
                            }
                        />
                        <Input
                            label="Complemento"
                            placeholder="Sala 101, Bloco A..."
                            value={attendanceData.complement}
                            onChange={(e) =>
                                setAttendanceData({ ...attendanceData, complement: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
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
                        <Input
                            label="CEP"
                            value={attendanceData.zip_code}
                            onChange={(e) =>
                                setAttendanceData({ ...attendanceData, zip_code: e.target.value })
                            }
                        />
                    </div>

                    {/* Configurações avançadas */}
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
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
    );
}
