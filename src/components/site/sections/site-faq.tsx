"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteSectionProps, SiteFAQ } from "@/types/site-types";

interface SiteFAQSectionProps extends SiteSectionProps {
    faqs: SiteFAQ[];
}

export function SiteFAQSection({ faqs, primaryColor }: SiteFAQSectionProps) {
    // Se não houver FAQs, não renderizar
    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <h2
                    className="text-3xl font-bold mb-10 text-center"
                    style={{ color: primaryColor }}
                >
                    Perguntas Frequentes
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq) => (
                        <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            <AccordionTrigger className="px-6 py-6 text-left font-medium text-gray-900 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 text-gray-600 whitespace-pre-wrap">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
