import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Tipos de rate limit
export type RateLimitType =
    | "default"      // 10 requests per 10 seconds (general APIs)
    | "strict"       // 5 requests per 10 seconds (sensitive APIs)
    | "auth"         // 3 requests per 60 seconds (login/signup)
    | "contact";     // 2 requests per 60 seconds (contact forms)

// Configurações por tipo
const RATE_LIMIT_CONFIGS = {
    default: { requests: 10, window: "10 s" },
    strict: { requests: 5, window: "10 s" },
    auth: { requests: 3, window: "60 s" },
    contact: { requests: 2, window: "60 s" },
} as const;

// Inicializa Redis client
// Em desenvolvimento, usamos um mock se não houver Redis configurado
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Cria rate limiters para cada tipo
const rateLimiters: Record<RateLimitType, Ratelimit | null> = {
    default: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
            RATE_LIMIT_CONFIGS.default.requests,
            RATE_LIMIT_CONFIGS.default.window
        ),
        analytics: true,
        prefix: "@upstash/ratelimit:default",
    }) : null,

    strict: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
            RATE_LIMIT_CONFIGS.strict.requests,
            RATE_LIMIT_CONFIGS.strict.window
        ),
        analytics: true,
        prefix: "@upstash/ratelimit:strict",
    }) : null,

    auth: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
            RATE_LIMIT_CONFIGS.auth.requests,
            RATE_LIMIT_CONFIGS.auth.window
        ),
        analytics: true,
        prefix: "@upstash/ratelimit:auth",
    }) : null,

    contact: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
            RATE_LIMIT_CONFIGS.contact.requests,
            RATE_LIMIT_CONFIGS.contact.window
        ),
        analytics: true,
        prefix: "@upstash/ratelimit:contact",
    }) : null,
};

/**
 * Verifica rate limit para um identificador (geralmente IP)
 * Retorna { success: true } se permitido, ou uma Response de erro se bloqueado
 */
export async function checkRateLimit(
    identifier: string,
    type: RateLimitType = "default"
): Promise<{ success: true } | NextResponse> {
    const limiter = rateLimiters[type];

    // Se não há Redis configurado, permite tudo (dev mode)
    if (!limiter) {
        if (process.env.NODE_ENV === "development") {
            console.log(`[Rate Limit] Skipping - Redis not configured (dev mode)`);
        }
        return { success: true };
    }

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
        return NextResponse.json(
            {
                error: "Too many requests. Please try again later.",
                retryAfter: Math.ceil((reset - Date.now()) / 1000),
            },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": String(limit),
                    "X-RateLimit-Remaining": String(remaining),
                    "X-RateLimit-Reset": String(reset),
                    "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
                },
            }
        );
    }

    return { success: true };
}

/**
 * Helper para obter IP do request
 */
export function getClientIP(request: Request): string {
    // Vercel / Cloudflare headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    // Fallback
    return "127.0.0.1";
}
