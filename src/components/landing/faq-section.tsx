"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Preciso saber programar?",
        answer: "Não! O PsiBuilder foi feito para ser fácil. Você só precisa preencher suas informações e escolher as cores. Tudo é visual, como editar um documento do Word."
    },
    {
        question: "Posso usar meu próprio domínio?",
        answer: "Sim! No plano Profissional você pode conectar seu próprio domínio (ex: www.seusite.com.br). Nós até ajudamos você a configurar."
    },
    {
        question: "Posso cancelar quando quiser?",
        answer: "Com certeza! Não existe fidelidade. Você pode cancelar quando quiser e seu site volta para o plano gratuito automaticamente."
    },
    {
        question: "O site fica fora do ar alguma vez?",
        answer: "Nossos servidores têm 99,9% de disponibilidade. Usamos a mesma infraestrutura de grandes empresas como Netflix e Airbnb."
    },
    {
        question: "Como funciona o suporte?",
        answer: "Temos suporte por email para todos os planos. No plano Profissional, você tem prioridade e resposta em até 4 horas úteis."
    }
];

export function FAQSection() {
    return (
        <section id="faq" className="py-20">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Perguntas frequentes
                    </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-gray-50 rounded-xl border-none"
                        >
                            <AccordionTrigger className="px-6 py-6 text-left font-semibold text-gray-900 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
