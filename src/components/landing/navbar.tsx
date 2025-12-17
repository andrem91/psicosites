"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ScrollLink } from "@/components/ui/scroll-link";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { to: "para-quem", label: "Para quem" },
        { to: "como-funciona", label: "Como funciona" },
        { to: "planos", label: "Planos" },
        { to: "faq", label: "FAQ" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                        <span className="text-xl font-bold text-gray-900">PsiBuilder</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <ScrollLink
                                key={link.to}
                                to={link.to}
                                className="text-gray-600 hover:text-gray-900 text-sm cursor-pointer"
                            >
                                {link.label}
                            </ScrollLink>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/cadastro"
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Criar meu site
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link
                            href="/cadastro"
                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Criar site
                        </Link>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-2" aria-label="Abrir menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px]">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                                        PsiBuilder
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8">
                                    {navLinks.map((link) => (
                                        <ScrollLink
                                            key={link.to}
                                            to={link.to}
                                            className="text-gray-600 hover:text-gray-900 py-2 text-base cursor-pointer"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </ScrollLink>
                                    ))}
                                    <hr className="my-2" />
                                    <Link
                                        href="/login"
                                        className="text-gray-600 hover:text-gray-900 py-2 text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href="/cadastro"
                                        className="w-full px-4 py-3 bg-indigo-600 text-white text-center font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Criar meu site grátis
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}

