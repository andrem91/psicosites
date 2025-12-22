-- =============================================
-- Migration: Integração Mercado Pago (Assinaturas)
-- =============================================

-- Adicionar coluna para armazenar o ID da assinatura do Mercado Pago
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS mercadopago_subscription_id TEXT;

-- Adicionar coluna para armazenar o ID do pagamento do Mercado Pago
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS mercadopago_payment_id TEXT;

-- Criar índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_subscriptions_mercadopago_subscription_id 
ON subscriptions(mercadopago_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_mercadopago_payment_id 
ON subscriptions(mercadopago_payment_id);

-- Remover referências ao Asaas se existirem (migração de gateway)
-- Mantemos as colunas antigas por segurança, marcando como deprecated
COMMENT ON COLUMN subscriptions.asaas_customer_id IS 'DEPRECATED: Use mercadopago_subscription_id';
COMMENT ON COLUMN subscriptions.asaas_subscription_id IS 'DEPRECATED: Use mercadopago_subscription_id';
