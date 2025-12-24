# 💳 Plano de Implementação - Monetização + Domínio Próprio

**Última atualização:** Dezembro/2024  
**Prioridade:** Pré-lançamento  
**Estimativa:** 30-50 horas

---

## 📋 Decisões Confirmadas

| Item | Valor |
|------|-------|
| **Plano Gratuito** | R$0 |
| **Plano Básico** | R$49/mês |
| **Plano Pro** | R$79/mês |
| **Gateway** | Mercado Pago |
| **Ordem** | Pagamento → Domínio |

---

## 📊 Tabela de Features por Plano

| Recurso | Gratuito | Básico (R$49) | Pro (R$79) |
|---------|----------|---------------|------------|
| Site + subdomínio | ✅ | ✅ | ✅ |
| Domínio próprio | ❌ | ✅ | ✅ |
| Blog | ⚠️ 3 posts | ✅ Ilimitado | ✅ Ilimitado |
| Estatísticas | ❌ | ✅ | ✅ |
| Formulário de contato | ✅ | ✅ | ✅ |
| FAQ e Depoimentos | ✅ | ✅ | ✅ |
| Remover "by PsicoSites" | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ |

---

## 🔧 Fase 1: Definição de Planos (2-3 horas)

### 1.1 Criar Arquivo de Constantes

**Arquivo:** `src/lib/plans.ts`

```typescript
export type PlanType = 'free' | 'basic' | 'pro';

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  priceId?: string; // Mercado Pago
  features: {
    blog_posts: number; // -1 = ilimitado
    custom_domain: boolean;
    statistics: boolean;
    remove_branding: boolean;
    priority_support: boolean;
  };
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: {
      blog_posts: 3,
      custom_domain: false,
      statistics: false,
      remove_branding: false,
      priority_support: false,
    },
  },
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 49,
    features: {
      blog_posts: -1,
      custom_domain: true,
      statistics: true,
      remove_branding: false,
      priority_support: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 79,
    features: {
      blog_posts: -1,
      custom_domain: true,
      statistics: true,
      remove_branding: true,
      priority_support: true,
    },
  },
};
```

### 1.2 Helper de Verificação

```typescript
// src/lib/plans.ts (continuação)

export function canUseFeature(
  plan: PlanType,
  feature: keyof PlanConfig['features']
): boolean {
  return !!PLANS[plan]?.features[feature];
}

export function getBlogPostLimit(plan: PlanType): number {
  return PLANS[plan].features.blog_posts;
}

export function getUserPlan(subscription: { plan: string } | null): PlanType {
  if (!subscription) return 'free';
  return (subscription.plan as PlanType) || 'free';
}
```

### 1.3 Atualizar Página de Planos

**Arquivo:** `src/app/dashboard/planos/page.tsx`

- Usar constantes do `lib/plans.ts`
- Adicionar botões de checkout reais
- Mostrar plano atual do usuário

---

## 💳 Fase 2: Mercado Pago (15-20 horas)

### 2.1 Setup Inicial

```bash
npm install mercadopago
```

**Variáveis de ambiente:**
```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxx
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxx
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxx
```

### 2.2 Estrutura de Arquivos

```
src/
├── lib/
│   ├── plans.ts              # Constantes de planos
│   └── mercadopago.ts        # Cliente MP
├── app/
│   └── api/
│       └── payments/
│           ├── create-preference/route.ts
│           ├── webhook/route.ts
│           └── subscription/route.ts
```

### 2.3 Cliente Mercado Pago

**Arquivo:** `src/lib/mercadopago.ts`

```typescript
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! 
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);
```

### 2.4 API: Criar Preferência

**Arquivo:** `src/app/api/payments/create-preference/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { preferenceClient } from '@/lib/mercadopago';
import { PLANS } from '@/lib/plans';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await request.json();
  const plan = PLANS[planId as keyof typeof PLANS];

  if (!plan || plan.price === 0) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // Buscar email do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('user_id', user.id)
    .single();

  const preference = await preferenceClient.create({
    body: {
      items: [{
        id: plan.id,
        title: `PsicoSites ${plan.name}`,
        quantity: 1,
        unit_price: plan.price,
        currency_id: 'BRL',
      }],
      payer: {
        email: profile?.email || user.email,
        name: profile?.full_name,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos?status=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos?status=pending`,
      },
      auto_return: 'approved',
      external_reference: `${user.id}:${plan.id}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
    },
  });

  return NextResponse.json({ 
    preferenceId: preference.id,
    initPoint: preference.init_point 
  });
}
```

### 2.5 API: Webhook

**Arquivo:** `src/app/api/payments/webhook/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { paymentClient } from '@/lib/mercadopago';
import { createClient } from '@supabase/supabase-js';

// Cliente admin para bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status === 'approved') {
      const [userId, planId] = payment.external_reference?.split(':') || [];

      if (userId && planId) {
        // Atualizar subscription
        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan: planId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
          .eq('user_id', userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
```

### 2.6 Fluxo de Checkout

```
1. Usuário clica "Assinar Básico"
2. Frontend chama POST /api/payments/create-preference
3. API retorna { initPoint: "https://mercadopago.com/..." }
4. Frontend redireciona para initPoint
5. Usuário paga (Pix, Cartão, Boleto)
6. MP chama webhook
7. Webhook atualiza subscriptions
8. Usuário redirecionado para /dashboard/planos?status=success
```

---

## 🌐 Fase 3: Domínio Próprio (15-20 horas)

### 3.1 Migration

**Arquivo:** `supabase/migrations/20241219000000_domain_verification.sql`

```sql
ALTER TABLE sites ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS domain_verification_token TEXT;
```

### 3.2 Interface do Dashboard

**Nova aba em:** `/dashboard/site` → "Domínio"

**Estados:**
1. Não tem plano → Mostrar upgrade
2. Tem plano, sem domínio → Formulário para adicionar
3. Domínio pendente → Instruções DNS + botão verificar
4. Domínio verificado → Status OK

### 3.3 Verificação DNS

**Arquivo:** `src/app/api/site/verify-domain/route.ts`

```typescript
import { NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function POST(request: Request) {
  const { domain, siteId } = await request.json();

  try {
    // Verificar CNAME
    const records = await dns.resolveCname(domain);
    const isValid = records.some(r => 
      r.includes('vercel') || r.includes('cname.vercel-dns.com')
    );

    if (isValid) {
      // Atualizar no banco
      // Configurar no Vercel via API
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ 
      verified: false, 
      message: 'CNAME não encontrado' 
    });
  } catch (error) {
    return NextResponse.json({ 
      verified: false, 
      message: 'Domínio não encontrado' 
    });
  }
}
```

### 3.4 Middleware de Routing

**Arquivo:** `src/middleware.ts` (adicionar)

```typescript
// Verificar se é domínio customizado
const customDomains = ['meudominio.com', ...];
if (customDomains.includes(hostname)) {
  // Buscar site pelo domínio
  // Rewrite para /site/[subdomain]
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Planos
- [ ] Criar `src/lib/plans.ts`
- [ ] Criar helpers de verificação
- [ ] Atualizar UI `/dashboard/planos`
- [ ] Mostrar plano atual do usuário

### Fase 2: Mercado Pago
- [ ] Criar conta Mercado Pago
- [ ] Obter credenciais (sandbox)
- [ ] Instalar SDK `mercadopago`
- [ ] Criar `src/lib/mercadopago.ts`
- [ ] Criar API `/api/payments/create-preference`
- [ ] Criar API `/api/payments/webhook`
- [ ] Integrar botões de checkout
- [ ] Testar fluxo completo (sandbox)
- [ ] Migrar para produção

### Fase 3: Domínio
- [ ] Criar migration `domain_verification`
- [ ] Criar UI de configuração
- [ ] Criar tutorial DNS
- [ ] Criar API `/api/site/verify-domain`
- [ ] Atualizar middleware
- [ ] Testar domínio customizado

### Fase 4: Restrições
- [ ] Verificar plano antes de criar post
- [ ] Verificar plano para estatísticas
- [ ] Verificar plano para domínio
- [ ] Verificar plano para branding
- [ ] Criar modal de upgrade

---

## 🔗 Referências

- [Mercado Pago SDK](https://github.com/mercadopago/sdk-nodejs)
- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints#domains)
