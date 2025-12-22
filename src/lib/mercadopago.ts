/**
 * Configuração do Mercado Pago - API de Assinaturas
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/subscriptions
 * 
 * Usa PreApproval para pagamentos recorrentes mensais
 */

import { MercadoPagoConfig, PreApproval, Payment } from "mercadopago";

// Inicializa o cliente do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: {
        timeout: 10000,
    },
});

// Instâncias dos serviços
export const preApproval = new PreApproval(client);
export const payment = new Payment(client);

// Configuração do plano Pro - Assinatura Mensal
export const PRO_PLAN = {
    id: "psicosites-pro-monthly",
    title: "PsicoSites Pro",
    description: "Assinatura mensal com todas as funcionalidades premium",
    price: 47.0, // R$ 47/mês
    currency: "BRL",
    frequency: 1, // A cada 1 mês
    frequencyType: "months" as const, // Tipo de frequência
} as const;

// URLs de retorno
export const getSubscriptionUrls = (baseUrl: string) => ({
    success: `${baseUrl}/dashboard/planos?status=success`,
    failure: `${baseUrl}/dashboard/planos?status=failure`,
    pending: `${baseUrl}/dashboard/planos?status=pending`,
});

// Tipos para os webhooks de assinatura
export type MercadoPagoWebhookType =
    | "subscription_preapproval" // Eventos de assinatura
    | "payment"; // Eventos de pagamento

export type MercadoPagoWebhookAction =
    | "created"
    | "updated";

export interface MercadoPagoWebhookPayload {
    action: MercadoPagoWebhookAction;
    api_version: string;
    data: {
        id: string;
    };
    date_created: string;
    id: number;
    live_mode: boolean;
    type: MercadoPagoWebhookType;
    user_id: string;
}

// Status de assinatura mapeados para o banco
export const SUBSCRIPTION_STATUS_MAP: Record<string, { plan: string; status: string }> = {
    authorized: { plan: "pro", status: "active" },
    pending: { plan: "free", status: "pending" },
    paused: { plan: "free", status: "inactive" },
    cancelled: { plan: "free", status: "cancelled" },
};

// Status de pagamento mapeados
export const PAYMENT_STATUS_MAP: Record<string, string> = {
    approved: "active",
    pending: "pending",
    authorized: "active",
    in_process: "pending",
    in_mediation: "pending",
    rejected: "inactive",
    cancelled: "cancelled",
    refunded: "cancelled",
    charged_back: "cancelled",
};
