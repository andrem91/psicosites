"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

interface BlogListProps {
    posts: BlogPost[];
    subdomain: string;
}

export function BlogList({ posts: initialPosts, subdomain }: BlogListProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== id));
                toast.success("Artigo excluído com sucesso!");
            } else {
                toast.error("Erro ao excluir artigo");
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
            toast.error("Erro ao excluir artigo");
        }
        setDeleting(null);
        setDeleteId(null);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum artigo ainda
                </h3>
                <p className="text-gray-500 mb-6">
                    Crie seu primeiro artigo para atrair mais pacientes através do Google
                </p>
                <Link
                    href="/dashboard/blog/novo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Primeiro Artigo
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {posts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                            {/* Imagem */}
                            {post.featured_image_url ? (
                                <div className="relative w-24 h-16 flex-shrink-0">
                                    <Image
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded-lg"
                                        sizes="96px"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Conteúdo */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {post.title}
                                    </h3>
                                    <Badge className={post.is_published
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    }>
                                        {post.is_published ? "Publicado" : "Rascunho"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                    {post.excerpt || "Sem descrição"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {post.is_published && post.published_at
                                        ? `Publicado em ${formatDate(post.published_at)}`
                                        : `Criado em ${formatDate(post.created_at)}`}
                                </p>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-2">
                                {post.is_published && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/site/${subdomain}/blog/${post.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                        title="Ver no site"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/dashboard/blog/${post.id}`}
                                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                            aria-label="Editar artigo"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => setDeleteId(post.id)}
                                            disabled={deleting === post.id}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            aria-label="Excluir artigo"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alert Dialog de confirmação */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
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
