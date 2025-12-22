/**
 * Hook para gerenciar subscription e verificar plano do usuário
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS, type PlanType } from "@/lib/constants";

interface Subscription {
    id: string;
    user_id: string;
    plan: PlanType;
    status: "active" | "inactive" | "pending" | "cancelled";
    current_period_start: string | null;
    current_period_end: string | null;
}

interface UseSubscriptionReturn {
    subscription: Subscription | null;
    loading: boolean;
    error: string | null;
    isPro: boolean;
    limits: typeof PLAN_LIMITS.free | typeof PLAN_LIMITS.pro;
    canCreateBlogPost: (currentCount: number) => boolean;
    canAddTestimonial: (currentCount: number) => boolean;
    canUseColor: (colorHex: string) => boolean;
    canUseHeroVideo: boolean;
    canUseCustomDomain: boolean;
    refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = useCallback(async () => {
        try {
            setLoading(true);
            const supabase = createClient();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setSubscription(null);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (fetchError) {
                // Se não encontrar, assume plano free
                if (fetchError.code === "PGRST116") {
                    setSubscription({
                        id: "",
                        user_id: user.id,
                        plan: "free",
                        status: "active",
                        current_period_start: null,
                        current_period_end: null,
                    });
                } else {
                    throw fetchError;
                }
            } else {
                setSubscription(data as Subscription);
            }
        } catch (err) {
            console.error("Erro ao buscar subscription:", err);
            setError("Erro ao carregar informações do plano");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    // Verificar se é Pro ativo
    const isPro =
        subscription?.plan === "pro" && subscription?.status === "active";

    // Limites baseados no plano
    const limits = isPro ? PLAN_LIMITS.pro : PLAN_LIMITS.free;

    // Helpers para verificar limites
    const canCreateBlogPost = (currentCount: number): boolean => {
        return limits.blogPosts === -1 || currentCount < limits.blogPosts;
    };

    const canAddTestimonial = (currentCount: number): boolean => {
        return limits.testimonials === -1 || currentCount < limits.testimonials;
    };

    const canUseColor = (colorHex: string): boolean => {
        return limits.colors.some(
            (c) => c.hex.toLowerCase() === colorHex.toLowerCase()
        );
    };

    const canUseHeroVideo = limits.heroVideo;
    const canUseCustomDomain = limits.customDomain;

    return {
        subscription,
        loading,
        error,
        isPro,
        limits,
        canCreateBlogPost,
        canAddTestimonial,
        canUseColor,
        canUseHeroVideo,
        canUseCustomDomain,
        refetch: fetchSubscription,
    };
}
