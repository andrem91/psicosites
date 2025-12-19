import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Ajuste a taxa de amostras para performance
    tracesSampleRate: 1.0,

    // Define quais erros ignorar
    ignoreErrors: [
        // Erros de rede comuns
        "Network request failed",
        "Failed to fetch",
        "Load failed",
        // Erros de navegação
        "ResizeObserver loop limit exceeded",
        "Non-Error promise rejection captured",
    ],

    // Habilita replays de sessão para debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Só habilita em produção
    enabled: process.env.NODE_ENV === "production",
});
