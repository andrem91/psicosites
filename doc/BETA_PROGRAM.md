# 🎯 Programa Beta - PsicoSites

**Objetivo:** Recrutar 30-50 psicólogos para testar a plataforma com Pro grátis por 3 meses.

---

## 📋 Configuração do Programa

| Item | Valor |
|------|-------|
| **Duração** | 3 meses |
| **Plano oferecido** | Pro (R$79/mês) grátis |
| **Quantidade** | 30-50 psicólogos |
| **Requisitos** | Feedback + depoimento |

---

## 🔧 Implementação Técnica

### Opção 1: Upgrade Manual (MVP)

No Supabase SQL Editor:
```sql
-- Ativar Pro por 3 meses para um usuário
UPDATE subscriptions 
SET 
    plan = 'pro',
    status = 'active',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '3 months'
WHERE user_id = 'UUID_DO_USUARIO';
```

### Opção 2: Link com Parâmetro

URL: `psicosites.com.br/cadastro?beta=CODIGO2026`

Código no onboarding:
```typescript
// Detectar parâmetro beta
const searchParams = useSearchParams();
const betaCode = searchParams.get('beta');

if (betaCode === 'CODIGO2026') {
    // Criar subscription com Pro por 3 meses
    await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan: 'pro',
        status: 'active',
        current_period_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });
}
```

### Opção 3: Sistema de Cupons (Futuro)

Tabela `coupons`:
```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER DEFAULT 100,
    plan TEXT DEFAULT 'pro',
    duration_months INTEGER DEFAULT 3,
    max_uses INTEGER DEFAULT 50,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📅 Cronograma

| Fase | Ação | Prazo |
|------|------|-------|
| **1. Preparação** | Criar página de inscrição | Antes do lançamento |
| **2. Divulgação** | Postar em grupos/LinkedIn | Semana 1 |
| **3. Seleção** | Escolher 30-50 participantes | Semana 1-2 |
| **4. Ativação** | Enviar links + ativar Pro | Semana 2 |
| **5. Suporte** | Grupo WhatsApp ativo | Meses 1-3 |
| **6. Coleta** | Feedback + depoimentos | Mês 3 |
| **7. Conversão** | Oferecer desconto para continuar | Mês 3 |

---

## 📝 Formulário de Inscrição

Campos:
- Nome completo
- Email
- WhatsApp
- CRP
- Especialidade principal
- Já tem site? (sim/não)
- Por que quer participar? (textarea)

---

## 💬 Grupo WhatsApp

**Regras:**
- Apresentação no primeiro dia
- Postar dúvidas livremente
- Feedback semanal (opcional)
- Sem spam/propaganda

**Conteúdo a postar:**
- Novidades da plataforma
- Dicas de uso
- Perguntas para feedback
- Enquetes rápidas

---

## 🎁 Benefícios Pós-Beta

| Opção | Desconto |
|-------|----------|
| Assinar no último mês | 30% vitalício |
| Indicar 3 colegas | +1 mês grátis |
| Depoimento em vídeo | 50% por 6 meses |

---

## ✅ Checklist de Lançamento Beta

- [ ] Criar landing page de inscrição
- [ ] Formulário Google Forms / Typeform
- [ ] Criar grupo WhatsApp
- [ ] Preparar mensagens de boas-vindas
- [ ] Script SQL para ativar Pro
- [ ] Template de email de convite
- [ ] Template de email de fim do período
