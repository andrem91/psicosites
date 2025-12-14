"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order_index: number;
    is_active: boolean;
}

// Perguntas padrão sugeridas
const DEFAULT_FAQS = [
    {
        question: "Qual é a frequência e duração das sessões?",
        answer: "As sessões têm duração de aproximadamente 50 minutos. A frequência inicial recomendada é semanal, podendo ser ajustada conforme a evolução do processo terapêutico.",
    },
    {
        question: "Preciso ter um diagnóstico para começar a terapia?",
        answer: "Não. A psicoterapia é indicada para qualquer pessoa que deseje autoconhecimento, desenvolvimento pessoal ou ajuda para lidar com questões emocionais e comportamentais.",
    },
    {
        question: "A terapia funciona online?",
        answer: "Sim! O atendimento online é tão eficaz quanto o presencial e oferece mais flexibilidade. Utilizo plataformas seguras que garantem sigilo e qualidade na conexão.",
    },
    {
        question: "Como funciona o sigilo profissional?",
        answer: "Tudo o que é compartilhado em sessão é absolutamente confidencial, conforme o Código de Ética do Psicólogo. Suas informações nunca serão compartilhadas sem autorização.",
    },
    {
        question: "Quanto tempo dura o tratamento?",
        answer: "O tempo varia de acordo com os objetivos e necessidades de cada pessoa. Algumas questões podem ser trabalhadas em poucos meses, outras requerem acompanhamento mais longo.",
    },
];

interface FAQEditorProps {
    siteId: string;
    initialFaqs?: FAQ[];
}

export function FAQEditor({ siteId, initialFaqs = [] }: FAQEditorProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            const res = await fetch("/api/site/faqs");
            const data = await res.json();
            if (data.faqs) {
                setFaqs(data.faqs);
            }
        } catch (error) {
            console.error("Erro ao carregar FAQs:", error);
        }
    };

    const handleAdd = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/site/faqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
            });

            if (res.ok) {
                const data = await res.json();
                setFaqs([...faqs, data.faq]);
                setNewQuestion("");
                setNewAnswer("");
                setIsAdding(false);
            }
        } catch (error) {
            console.error("Erro ao adicionar FAQ:", error);
        }
        setLoading(false);
    };

    const handleAddSuggested = async (faq: { question: string; answer: string }) => {
        setLoading(true);
        try {
            const res = await fetch("/api/site/faqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(faq),
            });

            if (res.ok) {
                const data = await res.json();
                setFaqs([...faqs, data.faq]);
            }
        } catch (error) {
            console.error("Erro ao adicionar FAQ:", error);
        }
        setLoading(false);
    };

    const handleEdit = (faq: FAQ) => {
        setEditingId(faq.id);
        setEditQuestion(faq.question);
        setEditAnswer(faq.answer);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editQuestion.trim() || !editAnswer.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/site/faqs", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    question: editQuestion,
                    answer: editAnswer,
                }),
            });

            if (res.ok) {
                setFaqs(
                    faqs.map((f) =>
                        f.id === editingId ? { ...f, question: editQuestion, answer: editAnswer } : f
                    )
                );
                setEditingId(null);
            }
        } catch (error) {
            console.error("Erro ao atualizar FAQ:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/site/faqs?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setFaqs(faqs.filter((f) => f.id !== id));
            }
        } catch (error) {
            console.error("Erro ao excluir FAQ:", error);
        }
        setLoading(false);
    };

    // Verificar quais sugestões já foram adicionadas
    const availableSuggestions = DEFAULT_FAQS.filter(
        (suggestion) => !faqs.some((faq) => faq.question === suggestion.question)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Perguntas Frequentes (FAQ)</h3>
                    <p className="text-sm text-gray-500">
                        Adicione perguntas e respostas que seus pacientes costumam fazer
                    </p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    + Adicionar
                </Button>
            </div>

            {/* Lista de FAQs */}
            {faqs.length === 0 && !isAdding && (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">Nenhuma FAQ cadastrada ainda</p>
                    <Button variant="outline" onClick={() => setShowSuggestions(true)}>
                        Ver sugestões de perguntas
                    </Button>
                </div>
            )}

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        {editingId === faq.id ? (
                            <div className="space-y-3">
                                <Input
                                    value={editQuestion}
                                    onChange={(e) => setEditQuestion(e.target.value)}
                                    placeholder="Pergunta"
                                />
                                <textarea
                                    value={editAnswer}
                                    onChange={(e) => setEditAnswer(e.target.value)}
                                    placeholder="Resposta"
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[100px] text-gray-900"
                                />
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
                                        <h4 className="font-medium text-gray-900">{faq.question}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
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
                    <h4 className="font-medium text-indigo-900 mb-3">Nova Pergunta</h4>
                    <div className="space-y-3">
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Digite a pergunta"
                        />
                        <textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Digite a resposta"
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[100px] text-gray-900"
                        />
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

            {/* Sugestões de perguntas */}
            {(showSuggestions || faqs.length === 0) && availableSuggestions.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">💡 Sugestões de perguntas</h4>
                    <div className="space-y-2">
                        {availableSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                            >
                                <span className="text-sm text-amber-900">{suggestion.question}</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddSuggested(suggestion)}
                                    disabled={loading}
                                    className="ml-2 shrink-0"
                                >
                                    + Usar
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
