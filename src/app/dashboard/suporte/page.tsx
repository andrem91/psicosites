import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "Suporte | PsiBuilder",
    description: "Central de ajuda e suporte do PsiBuilder",
};

const faqs = [
    {
        question: "Como faço para criar meu site?",
        answer: "Após fazer login, você será guiado pelo processo de onboarding onde poderá preencher seus dados profissionais, escolher cores e publicar seu site em poucos minutos.",
    },
    {
        question: "Posso usar meu próprio domínio?",
        answer: "Sim! No plano Profissional você pode conectar seu domínio próprio (ex: www.seusite.com.br). Entre em contato conosco para ajuda na configuração.",
    },
    {
        question: "Como edito as informações do meu site?",
        answer: "Acesse 'Meu Site' no menu lateral do dashboard. Lá você pode editar todas as informações, adicionar especialidades, FAQs, depoimentos e muito mais.",
    },
    {
        question: "Como faço para cancelar minha assinatura?",
        answer: "Você pode cancelar a qualquer momento acessando 'Planos' no menu. Seu site continuará funcionando no plano gratuito após o cancelamento.",
    },
    {
        question: "O site funciona em celulares?",
        answer: "Sim! Todos os sites criados no PsiBuilder são responsivos e se adaptam automaticamente a qualquer tamanho de tela.",
    },
    {
        question: "Como os pacientes entram em contato comigo?",
        answer: "Seu site terá um botão de WhatsApp sempre visível, além de um formulário de contato. Você receberá as mensagens diretamente.",
    },
];

export default function SuportePage() {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Suporte</h1>
                <p className="text-gray-500">
                    Encontre respostas para suas dúvidas ou entre em contato conosco
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Contato por Email</h3>
                            <p className="text-sm text-gray-500 mb-3">
                                Respondemos em até 24 horas úteis
                            </p>
                            <a href="mailto:suporte@psibuilder.com.br" className="text-indigo-600 font-medium hover:underline">
                                suporte@psibuilder.com.br
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Tutoriais</h3>
                            <p className="text-sm text-gray-500 mb-3">
                                Guias passo a passo para usar o PsiBuilder
                            </p>
                            <span className="text-gray-400 text-sm">Em breve!</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Perguntas Frequentes</h2>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Back Link */}
            <div className="text-center">
                <Link href="/dashboard">
                    <Button variant="outline">
                        ← Voltar ao Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
