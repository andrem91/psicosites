"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface DomainPageClientProps {
    site: {
        id: string;
        subdomain: string;
        custom_domain: string | null;
    } | null;
    isPro: boolean;
}

export function DomainPageClient({ site, isPro }: DomainPageClientProps) {
    const [customDomain, setCustomDomain] = useState(site?.custom_domain || "");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
    const [verificationMessage, setVerificationMessage] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    const supabase = createClient();

    const handleSaveDomain = async () => {
        if (!site?.id) return;

        setIsSaving(true);
        setSaveMessage("");

        try {
            // Limpar domínio (remover http://, www., espaços)
            let cleanDomain = customDomain
                .toLowerCase()
                .trim()
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/\/$/, "");

            const { error } = await supabase
                .from("sites")
                .update({ custom_domain: cleanDomain || null })
                .eq("id", site.id);

            if (error) throw error;

            setCustomDomain(cleanDomain);
            setSaveMessage("Domínio salvo com sucesso! Agora configure o DNS.");
            setVerificationStatus("idle");
        } catch (error) {
            console.error("Erro ao salvar domínio:", error);
            setSaveMessage("Erro ao salvar domínio. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleVerifyDomain = async () => {
        if (!customDomain) return;

        setIsVerifying(true);
        setVerificationStatus("idle");
        setVerificationMessage("");

        try {
            const response = await fetch("/api/site/verify-domain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: customDomain }),
            });

            const data = await response.json();

            if (data.verified) {
                setVerificationStatus("success");
                setVerificationMessage("DNS configurado corretamente! Seu domínio está funcionando.");
            } else {
                setVerificationStatus("error");
                setVerificationMessage(data.message || "DNS ainda não propagou. Aguarde até 48h e tente novamente.");
            }
        } catch (error) {
            setVerificationStatus("error");
            setVerificationMessage("Erro ao verificar. Tente novamente em alguns minutos.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleRemoveDomain = async () => {
        if (!site?.id) return;

        if (!confirm("Tem certeza que deseja remover o domínio personalizado?")) return;

        setIsSaving(true);
        try {
            await supabase
                .from("sites")
                .update({ custom_domain: null })
                .eq("id", site.id);

            setCustomDomain("");
            setVerificationStatus("idle");
            setSaveMessage("Domínio removido.");
        } catch (error) {
            console.error("Erro ao remover domínio:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Se não for Pro, mostrar upgrade
    if (!isPro) {
        return (
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">🌐 Seu Domínio</h1>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Recurso exclusivo do Plano Pro</h2>
                        <p className="text-gray-600 mb-6">
                            Use seu próprio domínio (ex: <strong>seusite.com.br</strong>) em vez do subdomínio padrão.
                        </p>

                        <div className="bg-white rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-500 mb-2">Seu site atual:</p>
                            <p className="font-mono text-indigo-600 font-medium">
                                {site?.subdomain}.psicosites.com.br
                            </p>
                        </div>

                        <Link
                            href="/dashboard/planos"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            ✨ Fazer upgrade para Pro
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🌐 Seu Domínio</h1>
            <p className="text-gray-600 mb-8">Configure seu domínio personalizado para ter um endereço próprio.</p>

            {/* Status atual */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Seu site atualmente pode ser acessado em:</p>
                <div className="flex flex-wrap gap-2">
                    <a
                        href={`https://${site?.subdomain}.psicosites.com.br`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-indigo-600 hover:underline"
                    >
                        {site?.subdomain}.psicosites.com.br
                    </a>
                    {site?.custom_domain && (
                        <>
                            <span className="text-gray-400">•</span>
                            <a
                                href={`https://${site.custom_domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-indigo-600 hover:underline"
                            >
                                {site.custom_domain}
                            </a>
                            {verificationStatus === "success" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                                    ✓ Ativo
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Formulário de domínio */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Domínio Personalizado</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seu domínio
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="seusite.com.br"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handleSaveDomain}
                                disabled={isSaving}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {isSaving ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Digite apenas o domínio, sem &quot;https://&quot; ou &quot;www.&quot;
                        </p>
                        {saveMessage && (
                            <p className={`text-sm mt-2 ${saveMessage.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                                {saveMessage}
                            </p>
                        )}
                    </div>

                    {customDomain && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleVerifyDomain}
                                disabled={isVerifying}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                            >
                                {isVerifying ? "Verificando..." : "🔍 Verificar DNS"}
                            </button>
                            <button
                                onClick={handleRemoveDomain}
                                disabled={isSaving}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                            >
                                Remover domínio
                            </button>
                        </div>
                    )}

                    {verificationStatus !== "idle" && (
                        <div className={`p-4 rounded-xl ${verificationStatus === "success"
                                ? "bg-green-50 border border-green-200"
                                : "bg-amber-50 border border-amber-200"
                            }`}>
                            <p className={verificationStatus === "success" ? "text-green-700" : "text-amber-700"}>
                                {verificationMessage}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tutorial DNS */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Como configurar seu DNS</h3>

                <div className="space-y-4 text-sm">
                    <div className="bg-white rounded-xl p-4">
                        <p className="font-medium text-blue-900 mb-2">Passo 1: Acesse seu provedor de domínio</p>
                        <p className="text-blue-700">
                            Entre no painel onde você comprou o domínio e procure por &quot;DNS&quot; ou &quot;Zona DNS&quot;.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                        <p className="font-medium text-blue-900 mb-2">Passo 2: Crie um registro CNAME</p>
                        <div className="bg-blue-50 rounded-lg p-3 font-mono text-sm">
                            <p><span className="text-blue-500">Tipo:</span> CNAME</p>
                            <p><span className="text-blue-500">Nome:</span> www (ou @)</p>
                            <p><span className="text-blue-500">Valor:</span> <span className="select-all">cname.vercel-dns.com</span></p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                        <p className="font-medium text-blue-900 mb-2">Passo 3: Aguarde a propagação</p>
                        <p className="text-blue-700">
                            Pode levar até 48 horas para o DNS propagar. Depois, clique em &quot;Verificar DNS&quot; acima.
                        </p>
                    </div>
                </div>
            </div>

            {/* Onde comprar domínio */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Onde comprar um domínio?</h3>
                <p className="text-gray-600 mb-4">
                    Ainda não tem um domínio? Veja alguns registradores populares:
                </p>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <strong>Registro.br</strong> - Oficial para domínios .com.br (recomendado)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-blue-500">•</span>
                        <strong>Hostinger</strong> - Opção internacional com bons preços
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        <strong>GoDaddy</strong> - Um dos maiores do mundo
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-purple-500">•</span>
                        <strong>Locaweb</strong> - Empresa brasileira tradicional
                    </li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                    Dica: Para psicólogos no Brasil, recomendamos um domínio .com.br pelo Registro.br.
                </p>
            </div>
        </div>
    );
}
