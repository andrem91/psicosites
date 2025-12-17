"use client";

import { ReactNode } from "react";

interface ScrollLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    "data-track"?: string;
}

/**
 * Componente para scroll suave até uma seção da página.
 * Usa button com onClick ao invés de <a href="#"> para evitar warnings de lint.
 */
export function ScrollLink({ to, children, className, style, onClick, ...props }: ScrollLinkProps) {
    const handleClick = () => {
        const element = document.getElementById(to);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        onClick?.();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={className}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}

