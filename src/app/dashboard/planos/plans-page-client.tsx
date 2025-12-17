"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Definição dos planos
const plans = [
    {
        id: "free",
        name: "Gratuito",
        price: "R$ 0",
        period: "/mês",
        description: "Ideal para começar sua presença online",
        features: [
            { text: "Site profissional básico", included: true },
            { text: "Subdomínio personalizado", included: true },
            { text: "Até 3 especialidades", included: true },
            { text: "Formulário de contato", included: true },
            { text: "WhatsApp integrado", included: true },
            { text: "Estatísticas básicas", included: true },
            { text: "Domínio próprio", included: false },
            { text: "Blog integrado", included: false },
            { text: "Especialidades ilimitadas", included: false },
            { text: "Sem marca PsiBuilder", included: false },
            { text: "SEO avançado", included: false },
            { text: "Suporte prioritário", included: false },
        ],
        buttonText: "Plano Atual",
        buttonVariant: "outline" as const,
        popular: false,
    },
    {
        id: "pro",
        name: "Profissional",
        price: "R$ 49",
        period: "/mês",
        description: "Tudo que você precisa para atrair mais pacientes",
        features: [
            { text: "Site profissional completo", included: true },
            { text: "Subdomínio personalizado", included: true },
            { text: "Especialidades ilimitadas", included: true },
            { text: "Formulário de contato", included: true },
            { text: "WhatsApp integrado", included: true },
            { text: "Estatísticas completas", included: true },
            { text: "Domínio próprio", included: true },
            { text: "Blog integrado", included: true },
            { text: "Sem marca PsiBuilder", included: true },
            { text: "SEO avançado", included: true },
            { text: "Suporte prioritário", included: true },
            { text: "Integrações premium", included: true },
        ],
        buttonText: "Fazer Upgrade",
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
}

export function PlansPageClient({ currentPlan }: PlansPageClientProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async (planId: string) => {
        if (planId === "free") return;

        setIsLoading(true);
        setSelectedPlan(planId);

        // TODO: Integrar com Asaas para pagamento
        // Por enquanto, apenas simula o processo
        setTimeout(() => {
            toast.info("Em breve! Estamos finalizando a integração de pagamentos.");
            setIsLoading(false);
            setSelectedPlan(null);
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Escolha seu Plano
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Comece gratuitamente e faça upgrade quando precisar de mais recursos.
                    Todos os planos incluem suporte por e-mail.
                </p>
            </div>

            {/* Badge do plano atual */}
            <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    Seu plano atual: <strong className="capitalize">{currentPlan}</strong>
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
                                <span className="inline-block px-4 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full">
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
                                    <span
                                        className={
                                            feature.included
                                                ? "text-gray-700"
                                                : "text-gray-400"
                                        }
                                    >
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Botão */}
                        <Button
                            onClick={() => handleUpgrade(plan.id)}
                            variant={plan.buttonVariant}
                            className="w-full"
                            isLoading={isLoading && selectedPlan === plan.id}
                            disabled={
                                plan.id === currentPlan ||
                                (isLoading && selectedPlan !== plan.id)
                            }
                        >
                            {plan.id === currentPlan ? "Plano Atual" : plan.buttonText}
                        </Button>
                    </div>
                ))}
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
                            Como funciona o período de teste?
                        </h4>
                        <p className="text-sm text-gray-600">
                            O plano Gratuito é permanente. Você pode usar pelo tempo
                            que quiser e fazer upgrade quando sentir necessidade.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Quais formas de pagamento são aceitas?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Aceitamos cartão de crédito, Pix e boleto bancário.
                            O pagamento é processado de forma segura pela Asaas.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Meus dados são preservados ao fazer upgrade?
                        </h4>
                        <p className="text-sm text-gray-600">
                            Absolutamente! Todos os seus dados, configurações e
                            conteúdo são mantidos ao mudar de plano.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="mt-16 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-12 text-white">
                <h2 className="text-2xl font-bold mb-4">
                    Pronto para atrair mais pacientes?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                    Psicólogos com sites profissionais têm 3x mais chances de serem
                    encontrados por novos pacientes.
                </p>
                <Button
                    onClick={() => handleUpgrade("pro")}
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                    isLoading={isLoading && selectedPlan === "pro"}
                >
                    Começar com o Plano Pro
                </Button>
            </div>
        </div>
    );
}
