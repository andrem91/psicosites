"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
    href?: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Skip link para acessibilidade via teclado.
 * Permite usuários pularem direto para o conteúdo principal.
 * Só aparece quando recebe foco (Tab).
 */
export function SkipLink({
    href = "#main-content",
    children = "Pular para o conteúdo principal",
    className
}: SkipLinkProps) {
    return (
        <a
            href={href}
            className={cn(
                "sr-only focus:not-sr-only",
                "fixed top-4 left-4 z-[100]",
                "bg-indigo-600 text-white px-4 py-2 rounded-lg",
                "font-medium text-sm",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                "transition-transform",
                className
            )}
        >
            {children}
        </a>
    );
}
