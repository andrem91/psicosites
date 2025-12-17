"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput as Input } from "@/components/ui/form-input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Testimonial {
    id: string;
    author_name: string;
    author_initials: string;
    content: string;
    rating: number;
    is_active: boolean;
}

interface TestimonialsEditorProps {
    siteId: string;
}

export function TestimonialsEditor({ siteId }: TestimonialsEditorProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [newName, setNewName] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const loadTestimonials = async () => {
        try {
            const res = await fetch("/api/site/testimonials");
            const data = await res.json();
            if (data.testimonials) {
                setTestimonials(data.testimonials);
            }
        } catch (error) {
            console.error("Erro ao carregar depoimentos:", error);
        }
    };

    useEffect(() => {
        loadTestimonials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = async () => {
        if (!newName.trim() || !newContent.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/site/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorName: newName, content: newContent, rating: newRating }),
            });

            if (res.ok) {
                const data = await res.json();
                setTestimonials([...testimonials, data.testimonial]);
                setNewName("");
                setNewContent("");
                setNewRating(5);
                setIsAdding(false);
            }
        } catch (error) {
            console.error("Erro ao adicionar depoimento:", error);
        }
        setLoading(false);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);
        setEditName(testimonial.author_name);
        setEditContent(testimonial.content);
        setEditRating(testimonial.rating);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editName.trim() || !editContent.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/site/testimonials", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    authorName: editName,
                    content: editContent,
                    rating: editRating,
                }),
            });

            if (res.ok) {
                setTestimonials(
                    testimonials.map((t) =>
                        t.id === editingId
                            ? { ...t, author_name: editName, content: editContent, rating: editRating }
                            : t
                    )
                );
                setEditingId(null);
            }
        } catch (error) {
            console.error("Erro ao atualizar depoimento:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/site/testimonials?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setTestimonials(testimonials.filter((t) => t.id !== id));
            }
        } catch (error) {
            console.error("Erro ao excluir depoimento:", error);
        }
        setLoading(false);
        setDeleteId(null);
    };

    const StarRating = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange?.(star)}
                    className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
                    disabled={!onChange}
                >
                    ★
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Depoimentos</h3>
                    <p className="text-sm text-gray-500">
                        Adicione depoimentos de pacientes (com consentimento)
                    </p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    + Adicionar
                </Button>
            </div>

            {/* Aviso sobre consentimento */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                ⚠️ <strong>Importante:</strong> Certifique-se de ter o consentimento por escrito do paciente antes de publicar qualquer depoimento.
                Você pode usar iniciais ou pseudônimos para preservar a privacidade.
            </div>

            {/* Lista de depoimentos */}
            {testimonials.length === 0 && !isAdding && (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-2">Nenhum depoimento cadastrado ainda</p>
                    <p className="text-xs text-gray-400">Adicione depoimentos para aumentar a credibilidade do seu site</p>
                </div>
            )}

            <div className="space-y-4">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        {editingId === testimonial.id ? (
                            <div className="space-y-3">
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Nome do paciente (ou iniciais)"
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Depoimento"
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[100px] text-gray-900"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Avaliação:</span>
                                    <StarRating rating={editRating} onChange={setEditRating} />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveEdit} disabled={loading}>
                                        Salvar
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-medium text-sm">
                                                {testimonial.author_initials}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{testimonial.author_name}</h4>
                                                <StarRating rating={testimonial.rating} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{testimonial.content}&rdquo;</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(testimonial.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulário de adição */}
            {isAdding && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                    <h4 className="font-medium text-indigo-900 mb-3">Novo Depoimento</h4>
                    <div className="space-y-3">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nome do paciente (ou iniciais, ex: 'Maria S.')"
                        />
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="Depoimento do paciente..."
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[100px] text-gray-900"
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Avaliação:</span>
                            <StarRating rating={newRating} onChange={setNewRating} />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAdd} disabled={loading}>
                                Adicionar
                            </Button>
                            <Button variant="outline" onClick={() => setIsAdding(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Alert Dialog de confirmação */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
