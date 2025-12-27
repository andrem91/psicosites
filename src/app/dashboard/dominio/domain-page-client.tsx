"use client";

import { useState } from "react";
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

    const handleSaveDomain = async () => {
        if (!site?.id) return;

        setIsSaving(true);
        setSaveMessage("");

        try {
            // Chamar API que integra Supabase + Vercel automaticamente
            const response = await fetch("/api/site/domain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    siteId: site.id,
                    domain: customDomain
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao salvar domínio");
            }

            setCustomDomain(data.domain || "");
            setSaveMessage(data.message || "Domínio salvo com sucesso!");
            setVerificationStatus("idle");
        } catch (error) {
            console.error("Erro ao salvar domínio:", error);
            setSaveMessage(error instanceof Error ? error.message : "Erro ao salvar domínio. Tente novamente.");
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
            // Usar nova API que integra com Vercel API (mais precisa)
            const response = await fetch(`/api/site/domain?domain=${encodeURIComponent(customDomain)}`, {
                method: "GET",
            });

            const data = await response.json();

            if (data.verified) {
                setVerificationStatus("success");
                setVerificationMessage(data.message || "DNS configurado corretamente! Seu domínio está funcionando.");
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
            // Usar nova API que remove do Vercel + Supabase
            const response = await fetch("/api/site/domain", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (response.ok) {
                setCustomDomain("");
                setVerificationStatus("idle");
                setSaveMessage(data.message || "Domínio removido.");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Erro ao remover domínio:", error);
            setSaveMessage(error instanceof Error ? error.message : "Erro ao remover domínio.");
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
                                psicosites.com.br/site/{site?.subdomain}
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
                        href={`https://psicosites.com.br/site/${site?.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-indigo-600 hover:underline"
                    >
                        psicosites.com.br/site/{site?.subdomain}
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

            {/* Tutorial completo Registro.br */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🇧🇷</span>
                    <div>
                        <h3 className="text-lg font-bold text-green-900">Como ter seu domínio próprio</h3>
                        <p className="text-green-700 text-sm">Tutorial completo usando o Registro.br (recomendado)</p>
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    {/* Passo 1 - Comprar */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                            <p className="font-semibold text-green-900">Compre seu domínio no Registro.br</p>
                        </div>
                        <div className="ml-11 space-y-2">
                            <p className="text-green-700">
                                Acesse <a href="https://registro.br" target="_blank" rel="noopener noreferrer" className="underline font-medium text-green-800">registro.br</a> e
                                crie uma conta (é grátis). Depois, pesquise o domínio que deseja (ex: <strong>seusite.com.br</strong>) e finalize a compra (~R$40/ano).
                            </p>
                            <p className="text-green-600 text-xs">
                                💡 Domínios .com.br passam mais confiança para pacientes brasileiros
                            </p>
                        </div>
                    </div>

                    {/* Passo 2 - Acessar */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                            <p className="font-semibold text-green-900">Acesse o painel do seu domínio</p>
                        </div>
                        <p className="text-green-700 ml-11">
                            Após a compra, faça login no <a href="https://registro.br" target="_blank" rel="noopener noreferrer" className="underline font-medium text-green-800">registro.br</a> e
                            clique no domínio que você acabou de comprar.
                        </p>
                    </div>

                    {/* Passo 3 - Alterar DNS */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                            <p className="font-semibold text-green-900">Clique em &quot;Alterar servidores DNS&quot;</p>
                        </div>
                        <div className="ml-11">
                            <p className="text-green-700 mb-3">Na seção DNS, clique no link indicado na imagem abaixo:</p>
                            <img
                                src="/images/tutorial-registrobr-dns.png"
                                alt="Tela do Registro.br mostrando onde clicar em Alterar servidores DNS"
                                className="rounded-lg border border-green-300 w-full"
                            />
                        </div>
                    </div>

                    {/* Passo 4 - Preencher */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                            <p className="font-semibold text-green-900">Preencha os servidores DNS</p>
                        </div>
                        <div className="ml-11">
                            <p className="text-green-700 mb-3">Apague qualquer valor existente e cole os servidores abaixo:</p>
                            <div className="bg-green-100 rounded-lg p-4 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-green-700 font-medium w-24">Servidor 1:</span>
                                    <code className="bg-white px-4 py-2 rounded font-mono text-green-900 select-all font-bold">ns1.vercel-dns.com</code>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-green-700 font-medium w-24">Servidor 2:</span>
                                    <code className="bg-white px-4 py-2 rounded font-mono text-green-900 select-all font-bold">ns2.vercel-dns.com</code>
                                </div>
                            </div>
                            <p className="text-green-600 text-xs mt-2">
                                💡 Clique nos valores acima para selecionar e copiar
                            </p>
                        </div>
                    </div>

                    {/* Passo 5 - Salvar */}
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">5</span>
                            <p className="font-semibold text-green-900">Salve e aguarde</p>
                        </div>
                        <p className="text-green-700 ml-11">
                            Clique em <strong>&quot;Salvar alterações&quot;</strong> no Registro.br.
                            Aguarde de <strong>15 minutos a 24 horas</strong> para as alterações serem aplicadas.
                            Depois, clique em &quot;Verificar DNS&quot; acima para confirmar que está tudo funcionando!
                        </p>
                    </div>
                </div>

                {/* Outras opções */}
                <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-green-700 text-xs mb-2">Comprou em outro lugar? Sem problema! Os servidores DNS são os mesmos:</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                        <a href="https://www.hostinger.com.br" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Hostinger</a>
                        <a href="https://www.godaddy.com/pt-br" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">GoDaddy</a>
                        <a href="https://www.locaweb.com.br" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Locaweb</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

