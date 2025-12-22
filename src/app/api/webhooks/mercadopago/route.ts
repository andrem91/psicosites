/**
 * Webhook: Notificações do Mercado Pago
 * POST /api/webhooks/mercadopago
 * 
 * Processa eventos de assinatura (subscription_preapproval) e pagamentos
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
    preApproval,
    payment,
    SUBSCRIPTION_STATUS_MAP,
    PAYMENT_STATUS_MAP,
    type MercadoPagoWebhookPayload,
} from "@/lib/mercadopago";

// Cliente Supabase com service role para operações admin
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const payload: MercadoPagoWebhookPayload = await request.json();

        console.log("Webhook recebido:", JSON.stringify(payload, null, 2));

        const { type, data, action } = payload;
        const resourceId = data?.id;

        if (!resourceId) {
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
        }

        // Tratar eventos de assinatura
        if (type === "subscription_preapproval") {
            await handleSubscriptionEvent(resourceId, action);
        }
        // Tratar eventos de pagamento (cobrança recorrente)
        else if (type === "payment") {
            await handlePaymentEvent(resourceId);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Erro no webhook:", error);
        return NextResponse.json(
            { error: "Erro ao processar webhook" },
            { status: 500 }
        );
    }
}

/**
 * Processa eventos de assinatura (criação, atualização, cancelamento)
 */
async function handleSubscriptionEvent(subscriptionId: string, action: string) {
    try {
        // Buscar detalhes da assinatura no Mercado Pago
        const subscriptionDetails = await preApproval.get({ id: subscriptionId });

        if (!subscriptionDetails) {
            console.error("Assinatura não encontrada:", subscriptionId);
            return;
        }

        const {
            external_reference: userId,
            status,
            date_created,
            next_payment_date,
        } = subscriptionDetails;

        if (!userId) {
            console.error("user_id não encontrado na assinatura");
            return;
        }

        // Mapear status para nosso sistema
        const mappedStatus = SUBSCRIPTION_STATUS_MAP[status || ""] || {
            plan: "free",
            status: "inactive",
        };

        console.log(`Atualizando assinatura para usuário ${userId}:`, {
            status,
            mappedStatus,
            action,
        });

        // Atualizar assinatura no banco
        const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({
                plan: mappedStatus.plan,
                status: mappedStatus.status,
                mercadopago_subscription_id: subscriptionId,
                current_period_start: date_created,
                current_period_end: next_payment_date,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

        if (error) {
            console.error("Erro ao atualizar subscription:", error);
        } else {
            console.log(`Subscription atualizada: ${userId} -> ${mappedStatus.plan}`);
        }
    } catch (error) {
        console.error("Erro ao processar evento de assinatura:", error);
    }
}

/**
 * Processa eventos de pagamento (cobranças recorrentes)
 */
async function handlePaymentEvent(paymentId: string) {
    try {
        // Buscar detalhes do pagamento
        const paymentDetails = await payment.get({ id: paymentId });

        if (!paymentDetails) {
            console.error("Pagamento não encontrado:", paymentId);
            return;
        }

        const {
            external_reference: userId,
            status,
            date_approved,
        } = paymentDetails;

        if (!userId) {
            console.error("user_id não encontrado no pagamento");
            return;
        }

        // Mapear status
        const subscriptionStatus = PAYMENT_STATUS_MAP[status || ""] || "pending";

        console.log(`Pagamento processado para usuário ${userId}:`, {
            status,
            subscriptionStatus,
        });

        // Atualizar apenas se for pagamento aprovado (renovação bem-sucedida)
        if (subscriptionStatus === "active") {
            // Calcular próximo período (30 dias)
            const now = new Date();
            const nextPeriod = new Date(now);
            nextPeriod.setMonth(nextPeriod.getMonth() + 1);

            const { error } = await supabaseAdmin
                .from("subscriptions")
                .update({
                    plan: "pro",
                    status: "active",
                    mercadopago_payment_id: paymentId,
                    current_period_start: date_approved || now.toISOString(),
                    current_period_end: nextPeriod.toISOString(),
                    updated_at: now.toISOString(),
                })
                .eq("user_id", userId);

            if (error) {
                console.error("Erro ao atualizar após pagamento:", error);
            }
        }
    } catch (error) {
        console.error("Erro ao processar evento de pagamento:", error);
    }
}

// Endpoint GET para verificação do webhook pelo Mercado Pago
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Webhook endpoint ativo",
        timestamp: new Date().toISOString(),
    });
}
