# 🗺️ Roadmap de Correções UX - PsiBuilder (Atualizado)

> **Última atualização:** 17/12/2024  
> **Status:** ~85% dos problemas resolvidos

---

## 📊 Visão Geral

| Fase | Prazo | Qtd Issues | Status |
|------|-------|-----------|--------|
| 1 - Críticos | 1-2 dias | 5 | ✅ Concluído |
| 2 - Altos | 3-5 dias | 5 | ✅ Concluído |
| 3 - Médios | 1-2 semanas | 5 | ✅ Concluído |
| 4 - Baixos | Backlog | 5+ | ⏳ Pendente |

---

# ✅ PROBLEMAS JÁ RESOLVIDOS (Resumo)

A refatoração com shadcn/ui resolveu automaticamente:

- ✅ `confirm()` → AlertDialog
- ✅ Validação de formulários → React Hook Form + Zod
- ✅ Mensagens de erro genéricas → Zod em português
- ✅ Falta de toasts → Sonner global
- ✅ Falta de componentes → shadcn/ui completo
- ✅ Acessibilidade em forms → aria-invalid, role="alert"
- ✅ Validação WhatsApp e CRP → Schemas com regex

---

# 🔴 FASE 1: CRÍTICOS (1-2 dias)

## Estimativa: 2-4 horas de trabalho

### 1.1 ✏️ Corrigir lang="en" → "pt-BR"
- **Arquivo:** `src/app/layout.tsx:27`
- **Tempo:** 2 minutos
- **Impacto:** SEO, acessibilidade

```tsx
// De:
<html lang="en">
// Para:
<html lang="pt-BR">
```

### 1.2 ✏️ Atualizar Metadata Genérica
- **Arquivo:** `src/app/layout.tsx:16-18`
- **Tempo:** 10 minutos

```tsx
export const metadata: Metadata = {
  title: "PsiBuilder - Crie seu Site Profissional de Psicologia",
  description: "A plataforma mais fácil para psicólogos criarem sites profissionais. Grátis, rápido e adequado às normas do CRP.",
  keywords: "psicólogo, site, psicologia, criador de site, CRP",
};
```

### 1.3 ✏️ Corrigir Typo "calma em e"
- **Arquivo:** `src/app/dashboard/site/site-editor.tsx:603`
- **Tempo:** 1 minuto

```tsx
// De:
Cores selecionadas para transmitir calma em e profissionalismo
// Para:
Cores selecionadas para transmitir calma e profissionalismo
```

### 1.4 🔧 Traduzir Mensagens de Erro do Supabase
- **Arquivo:** `src/app/(auth)/actions.ts`
- **Tempo:** 1 hora

```typescript
const ERROR_TRANSLATIONS: Record<string, string> = {
  "Invalid login credentials": "Email ou senha incorretos",
  "Email not confirmed": "Confirme seu email antes de entrar",
  "User already registered": "Este email já está cadastrado",
  "Password should be at least 6 characters": "A senha deve ter no mínimo 6 caracteres",
};

function translateError(error: string): string {
  return ERROR_TRANSLATIONS[error] || error;
}
```

### 1.5 🔧 Verificar/Implementar Envio de Email
- **Arquivo:** `src/app/api/site/contact/route.ts`
- **Tempo:** 2-3 horas
- **Dependência:** Configurar RESEND_API_KEY

---

# 🟠 FASE 2: ALTOS (3-5 dias)

## Estimativa: 6-10 horas de trabalho

### 2.1 🔧 Corrigir URLs Hardcoded
- **Arquivos:** 4 arquivos
- **Tempo:** 30 minutos

```typescript
// Criar helper
const getSiteUrl = (subdomain: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/site/${subdomain}`;
};
```

### 2.2 🔧 Substituir alert() em Planos
- **Arquivo:** `src/app/dashboard/planos/plans-page-client.tsx:89`
- **Tempo:** 15 minutos

```typescript
// De:
alert("Em breve! Estamos finalizando a integração de pagamentos.");
// Para:
toast.info("Em breve! Estamos finalizando a integração de pagamentos.");
```

### 2.3 📄 Criar Página de Suporte
- **Diretório:** `src/app/dashboard/suporte/`
- **Tempo:** 2-3 horas
- **Conteúdo:** FAQ, formulário de contato, tutoriais

### 2.4 📄 Criar Página Recuperar Senha
- **Diretório:** `src/app/(auth)/recuperar-senha/`
- **Tempo:** 2-3 horas
- **Implementar:** Form + action de reset via Supabase

### 2.5 🔧 Menu Hamburger na Landing
- **Arquivo:** `src/components/landing/navbar.tsx`
- **Tempo:** 1-2 horas
- **Usar:** Sheet component do shadcn/ui

---

# 🟡 FASE 3: MÉDIOS (1-2 semanas)

## Estimativa: 8-12 horas de trabalho

### 3.1 Seletor de Período Funcional
- **Arquivo:** `src/app/dashboard/estatisticas/`
- **Ação:** Implementar refetch com período selecionado

### 3.2 Máscaras Visuais de Input
- **WhatsApp:** `(11) 99999-9999`
- **CRP:** `06/12345`
- **Biblioteca:** react-input-mask ou similar

### 3.3 Indicador de Força de Senha
- **Locais:** Signup, Change Password
- **Biblioteca:** zxcvbn ou implementação manual

### 3.4 Open Graph Metadata
- **Arquivo:** `src/app/layout.tsx`
- **Adicionar:** og:image, twitter:card

### 3.5 Card "Completar Perfil" Inteligente
- **Arquivo:** `src/app/dashboard/page.tsx`
- **Ação:** Ocultar quando progress >= 100%

---

# 🟢 FASE 4: BACKLOG

### ✅ Implementados
- [x] Upload de foto no onboarding
- [x] Tooltip explicativo no link mágico
- [x] Skip link para acessibilidade
- [x] Skeleton loading components
- [x] Máscaras de input (WhatsApp, CRP)

### 🔧 Pendentes
- [ ] Limit 3 especialidades no plano gratuito
- [ ] Tour guiado para novos usuários
- [ ] Preview live no editor
- [ ] Dark mode

---

# 📧 EMAILS DO SUPABASE (Novo)

> Os emails de autenticação do Supabase precisam ser customizados.
> Configuração feita no [Supabase Dashboard](https://supabase.com/dashboard) → Auth → Email Templates

### Emails a Customizar:
- [ ] **Confirmação de email** - Traduzir para português + layout HTML
- [ ] **Reset de senha** - Traduzir para português + layout HTML
- [ ] **Magic link** - Traduzir para português + layout HTML
- [ ] **Mudança de email** - Traduzir para português + layout HTML

### Modelo sugerido:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; padding: 40px; }
    .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h2>PsiBuilder</h2>
    </div>
    <p>Olá!</p>
    <p>{{ conteúdo específico do email }}</p>
    <p><a href="{{ .ConfirmationURL }}" class="btn">{{ ação }}</a></p>
    <p>Se você não solicitou isso, ignore este email.</p>
  </div>
</body>
</html>
```

---

# 📋 Checklist de Testes

Após cada fase:
- [x] `npm run build` passa
- [ ] Lighthouse score mantido
- [ ] Fluxos principais funcionando
- [ ] Mobile responsivo
- [x] Mensagens em português

---

# 📈 Progresso

```
[██████████████████░░] 90% Resolvido

✅ Implementados nesta sessão: 21+
⏳ Pendentes: ~5 items
```

---

> **Última atualização:** 17/12/2024

