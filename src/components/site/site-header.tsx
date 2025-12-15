"use client";

import Link from "next/link";
import { useState } from "react";

interface SiteHeaderProps {
    siteName: string;
    logo?: string;
    primaryColor?: string;
    navItems?: { label: string; href: string }[];
}

export function SiteHeader({
    siteName,
    logo,
    primaryColor = "#6366f1",
    navItems = [],
}: SiteHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo / Nome */}
                <Link href="/" className="flex items-center gap-3">
                    {logo ? (
                        <img
                            src={logo}
                            alt={siteName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {siteName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                        {siteName}
                    </span>
                </Link>

                {/* Navegação Desktop */}
                {navItems.length > 0 && (
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* CTA Desktop & Hamburger Mobile */}
                <div className="flex items-center gap-3">
                    <a
                        href="#contato"
                        className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Agendar Consulta
                    </a>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Abrir menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
                    <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a
                            href="#contato"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-2 py-3 px-4 rounded-xl text-center text-base font-medium text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Agendar Consulta
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
