import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Ajuste a taxa de amostras para performance
    tracesSampleRate: 1.0,

    // Só habilita em produção
    enabled: process.env.NODE_ENV === "production",
});
