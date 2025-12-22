"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PRO_PRICE, FREE_COLORS, ALL_COLORS } from "@/lib/constants";

// Definição dos planos atualizada conforme PLANOS.md
const plans = [
    {
        id: "free",
        name: "Gratuito",
        price: "R$ 0",
        period: "/mês",
        description: "Ideal para começar sua presença online",
        features: [
            { text: "Site profissional completo", included: true },
            { text: `Até ${FREE_COLORS.length} opções de cores`, included: true },
            { text: "2 presets de fontes", included: true },
            { text: "Até 3 posts no blog", included: true },
            { text: "Até 3 depoimentos", included: true },
            { text: "WhatsApp integrado", included: true },
            { text: "Estatísticas básicas", included: true },
            { text: "Subdomínio .psicosites.com.br", included: true },
            { text: "Vídeo no Hero", included: false },
            { text: "Domínio próprio", included: false },
            { text: `${ALL_COLORS.length} opções de cores`, included: false },
            { text: "Badge discreto", included: false },
        ],
        buttonText: "Plano Atual",
        buttonVariant: "outline" as const,
        popular: false,
    },
    {
        id: "pro",
        name: "Pro",
        price: `R$ ${PRO_PRICE.monthly}`,
        period: "/mês",
        description: "Tudo que você precisa para se destacar",
        features: [
            { text: "Tudo do plano Gratuito", included: true },
            { text: `${ALL_COLORS.length} opções de cores`, included: true },
            { text: "5 presets de fontes", included: true },
            { text: "Blog ilimitado", included: true },
            { text: "Depoimentos ilimitados", included: true },
            { text: "Vídeo no Hero", included: true },
            { text: "Domínio próprio", included: true },
            { text: "Estatísticas avançadas", included: true },
            { text: "Badge discreto", included: true },
            { text: "Suporte prioritário", included: true },
        ],
        buttonText: "Assinar Pro",
        buttonVariant: "default" as const,
        popular: true,
    },
];

// Ícone de check
const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

// Ícone de X
const XIcon = () => (
    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface PlansPageClientProps {
    currentPlan: string;
    subscriptionStatus?: string;
}

export function PlansPageClient({ currentPlan, subscriptionStatus }: PlansPageClientProps) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // Tratar status de retorno do checkout
    useEffect(() => {
        const status = searchParams.get("status");
        if (status === "success") {
            toast.success("Pagamento aprovado! Seu plano Pro já está ativo.", {
                duration: 5000,
            });
        } else if (status === "failure") {
            toast.error("O pagamento não foi aprovado. Tente novamente.", {
                duration: 5000,
            });
        } else if (status === "pending") {
            toast.info("Aguardando confirmação do pagamento. Isso pode levar alguns minutos.", {
                duration: 5000,
            });
        }
    }, [searchParams]);

    const handleUpgrade = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao criar checkout");
            }

            // Redirecionar para o checkout do Mercado Pago
            // Em produção, usar init_point. Em sandbox, usar sandbox_init_point
            const checkoutUrl = process.env.NODE_ENV === "production"
                ? data.init_point
                : data.sandbox_init_point || data.init_point;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("URL de checkout não encontrada");
            }
        } catch (error) {
            console.error("Erro no checkout:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao processar pagamento");
            setIsLoading(false);
        }
    };

    const isPro = currentPlan === "pro" && subscriptionStatus === "active";

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Escolha seu Plano
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Comece gratuitamente e faça upgrade quando precisar de mais recursos.
                    Cancele quando quiser, sem multas.
                </p>
            </div>

            {/* Badge do plano atual */}
            <div className="text-center mb-8">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isPro
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-indigo-50 text-indigo-700"
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isPro ? "bg-white" : "bg-indigo-500"}`} />
                    Seu plano atual: <strong className="capitalize">{currentPlan}</strong>
                    {subscriptionStatus === "pending" && " (aguardando pagamento)"}
                </span>
            </div>

            {/* Cards de Planos */}
            <div className="grid md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white rounded-2xl border-2 p-8 transition-all ${plan.popular
                                ? "border-indigo-500 shadow-xl scale-[1.02]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {/* Badge Popular */}
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="inline-block px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full">
                                    Mais Popular
                                </span>
                            </div>
                        )}

                        {/* Header do Plano */}
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-4xl font-bold text-gray-900">
                                    {plan.price}
                                </span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                        </div>

                        {/* Lista de Features */}
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    {feature.included ? <CheckIcon /> : <XIcon />}
                                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Botão */}
                        {plan.id === "free" ? (
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                {currentPlan === "free" ? "Plano Atual" : "Plano Gratuito"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleUpgrade}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                                isLoading={isLoading}
                                disabled={isPro}
                            >
                                {isPro ? "✓ Plano Ativo" : "Assinar Pro"}
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Métodos de pagamento */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-3">Formas de pagamento aceitas:</p>
                <div className="flex justify-center items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Cartão
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Pix
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                        Boleto
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Pagamento processado com segurança pelo Mercado Pago
                </p>
            </div>

            {/* FAQ */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Perguntas Frequentes
                </h2>

                <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Posso cancelar a qualquer momento?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Sim! Você pode cancelar seu plano a qualquer momento.
                            Não há taxas de cancelamento ou fidelidade.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            O que acontece se eu cancelar?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Seu site continua ativo no plano Gratuito. Você não perde
                            nenhum conteúdo, apenas recursos premium.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Quais formas de pagamento são aceitas?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Aceitamos cartão de crédito, Pix e boleto bancário.
                            O pagamento é processado de forma segura pelo Mercado Pago.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Meus dados são preservados ao mudar de plano?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Absolutamente! Todos os seus dados, configurações e
                            conteúdo são mantidos ao mudar de plano.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            {!isPro && (
                <div className="mt-16 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-12 text-white">
                    <h2 className="text-2xl font-bold mb-4">
                        Pronto para atrair mais pacientes?
                    </h2>
                    <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                        Psicólogos com sites profissionais têm 3x mais chances de serem
                        encontrados por novos pacientes.
                    </p>
                    <Button
                        onClick={handleUpgrade}
                        className="bg-white text-indigo-600 hover:bg-gray-100"
                        isLoading={isLoading}
                    >
                        Assinar Pro por R$ {PRO_PRICE.monthly}/mês
                    </Button>
                </div>
            )}
        </div>
    );
}

