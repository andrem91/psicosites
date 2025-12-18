"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface BlogToggleProps {
    siteId: string;
    initialShowBlog: boolean;
}

export function BlogToggle({ siteId, initialShowBlog }: BlogToggleProps) {
    const [showBlog, setShowBlog] = useState(initialShowBlog);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        setShowBlog(checked);

        startTransition(async () => {
            try {
                const res = await fetch("/api/site/blog-visibility", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ siteId, showBlog: checked }),
                });

                if (!res.ok) {
                    throw new Error("Erro ao salvar");
                }

                toast.success(checked ? "Blog ativado!" : "Blog desativado!");
            } catch {
                // Reverter em caso de erro
                setShowBlog(!checked);
                toast.error("Erro ao atualizar configuração do blog");
            }
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Exibir Blog Público</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        {showBlog
                            ? "O Blog está visível no seu site público. Visitantes podem ver seus artigos."
                            : "O Blog está oculto. O link não aparece no menu e visitantes não podem acessar os artigos."
                        }
                    </p>
                </div>
                <Switch
                    checked={showBlog}
                    onCheckedChange={handleToggle}
                    disabled={isPending}
                    aria-label="Ativar ou desativar blog público"
                />
            </div>
        </div>
    );
}
