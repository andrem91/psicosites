/**
 * API Route: Criar Assinatura Mercado Pago
 * POST /api/checkout
 * 
 * Cria uma assinatura recorrente mensal para o plano Pro
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { preApproval, PRO_PLAN, getSubscriptionUrls } from "@/lib/mercadopago";

export async function POST() {
    try {
        const supabase = await createClient();

        // Verificar autenticação
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Buscar dados do perfil
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("user_id", user.id)
            .single();

        // Verificar se já tem assinatura ativa
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("plan, status, mercadopago_subscription_id")
            .eq("user_id", user.id)
            .single();

        if (subscription?.plan === "pro" && subscription?.status === "active") {
            return NextResponse.json(
                { error: "Você já possui uma assinatura Pro ativa" },
                { status: 400 }
            );
        }

        // Determinar URL base
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const urls = getSubscriptionUrls(baseUrl);

        // Criar assinatura no Mercado Pago
        const subscriptionResponse = await preApproval.create({
            body: {
                // Razão/motivo da assinatura
                reason: PRO_PLAN.title,

                // Configuração de recorrência automática
                auto_recurring: {
                    frequency: PRO_PLAN.frequency, // A cada 1
                    frequency_type: PRO_PLAN.frequencyType, // mês
                    transaction_amount: PRO_PLAN.price, // R$ 47
                    currency_id: PRO_PLAN.currency, // BRL
                },

                // URL de retorno após assinatura
                back_url: urls.success,

                // Referência externa (ID do usuário)
                external_reference: user.id,

                // Dados do pagador
                payer_email: profile?.email || user.email,
            },
        });

        if (!subscriptionResponse?.init_point) {
            throw new Error("Falha ao criar assinatura - init_point não retornado");
        }

        return NextResponse.json({
            init_point: subscriptionResponse.init_point,
            subscription_id: subscriptionResponse.id,
        });
    } catch (error) {
        console.error("Erro ao criar assinatura:", error);
        return NextResponse.json(
            { error: "Erro ao processar assinatura" },
            { status: 500 }
        );
    }
}
