"use client";

import { useEffect, useRef } from "react";

interface SiteTrackerProps {
    siteId: string;
}

export function SiteTracker({ siteId }: SiteTrackerProps) {
    const hasTracked = useRef(false);

    const trackEvent = async (eventType: string, referrer?: string) => {
        try {
            await fetch("/api/tracking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    siteId,
                    eventType,
                    referrer: referrer || null,
                }),
            });
        } catch (error) {
            // Silenciar erros de tracking para não afetar UX
            console.debug("Tracking:", eventType);
        }
    };

    useEffect(() => {
        // Evitar tracking duplicado
        if (hasTracked.current) return;
        hasTracked.current = true;

        // Page view
        trackEvent("page_view");

        // Unique visitor (usando localStorage)
        const visitorKey = `psi_visitor_${siteId}`;
        const today = new Date().toISOString().split("T")[0];
        const lastVisit = localStorage.getItem(visitorKey);

        if (lastVisit !== today) {
            localStorage.setItem(visitorKey, today);
            trackEvent("unique_visitor", document.referrer);
        }

        // Tracker de cliques no WhatsApp
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
        whatsappLinks.forEach((link) => {
            link.addEventListener("click", () => trackEvent("whatsapp_click"));
        });

        // Tracker de cliques no CTA (botões de agendar)
        const ctaButtons = document.querySelectorAll('a[href="#contato"], button[data-cta], [data-track-cta]');
        ctaButtons.forEach((btn) => {
            btn.addEventListener("click", () => trackEvent("cta_click"));
        });

        // Tracker também para links com texto "Agendar"
        const agendarLinks = document.querySelectorAll('a');
        agendarLinks.forEach((link) => {
            const text = link.textContent?.toLowerCase() || "";
            if (text.includes("agendar") || text.includes("marcar consulta")) {
                link.addEventListener("click", () => trackEvent("cta_click"));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteId]);

    return null; // Componente invisível
}
