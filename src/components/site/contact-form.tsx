"use client";

import { useState } from "react";

interface ContactFormProps {
    primaryColor?: string;
    psychologistName?: string;
    psychologistEmail?: string;
}

export function ContactForm({
    primaryColor = "#6366f1",
    psychologistName,
    psychologistEmail,
}: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/site/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    psychologistName,
                    psychologistEmail,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Erro ao enviar mensagem");
            }

            setStatus("success");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Erro ao enviar mensagem");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Mensagem Enviada!</h3>
                <p className="text-green-600">
                    Obrigado pelo contato. Retornaremos em breve.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm font-medium hover:underline"
                    style={{ color: primaryColor }}
                >
                    Enviar outra mensagem
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome *
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:border-transparent transition-shadow"
                        style={{ focusRing: primaryColor } as React.CSSProperties}
                        placeholder="Seu nome completo"
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:border-transparent transition-shadow"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone / WhatsApp
                </label>
                <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:border-transparent transition-shadow"
                    placeholder="(11) 99999-9999"
                />
            </div>

            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                </label>
                <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:border-transparent transition-shadow resize-none"
                    placeholder="Como posso ajudá-lo(a)?"
                />
            </div>

            {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
            >
                {status === "loading" ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Enviar Mensagem
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 text-center">
                Suas informações são tratadas com sigilo e confidencialidade.
            </p>
        </form>
    );
}
