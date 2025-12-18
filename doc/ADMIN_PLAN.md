# 🛡️ Módulo Admin - Plano de Implementação Técnico

**Última atualização:** 18/12/2024  
**Autor:** PsiBuilder Team  
**Prioridade:** Alta

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Banco de Dados](#banco-de-dados)
4. [Fases de Implementação](#fases-de-implementação)
5. [Segurança](#segurança)
6. [Estrutura de Arquivos](#estrutura-de-arquivos)

---

## 🎯 Visão Geral

O módulo Admin é uma área restrita da plataforma para administradores gerenciarem usuários, sites, métricas e configurações do sistema.

### Objetivos
- Controle centralizado da plataforma
- Visão macro de métricas e KPIs
- Gestão de usuários e sites
- Moderação de conteúdo
- Suporte aos usuários

### Acesso
- URL: `/admin/*`
- Acesso restrito via role `admin` ou `super_admin`
- Autenticação obrigatória

---

## 🏗️ Arquitetura

### Diagrama de Rotas

```
/admin
├── /                    → Dashboard principal (métricas)
├── /usuarios            → Lista de psicólogos
│   └── /[id]           → Detalhes do usuário
├── /sites               → Lista de sites
│   └── /[id]           → Detalhes do site
├── /analytics           → Métricas agregadas
├── /suporte             → Tickets (futuro)
├── /logs                → Logs de auditoria
└── /configuracoes       → Settings da plataforma
```

### Stack Técnica

| Componente | Tecnologia |
|------------|------------|
| Frontend | Next.js App Router |
| UI Components | shadcn/ui (já instalado) |
| Tabelas | @tanstack/react-table |
| Gráficos | Recharts (já instalado) |
| Auth | Supabase RLS + role check |
| API | Server Actions / Route Handlers |

---

## 🗄️ Banco de Dados

### Nova Tabela: `admin_roles`

```sql
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'support', 'finance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS: Apenas super_admins podem ver/editar
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage roles"
    ON admin_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role = 'super_admin'
        )
    );
```

### Nova Tabela: `admin_logs`

```sql
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL,  -- 'user.suspend', 'site.unpublish', etc
    target_type TEXT,      -- 'user', 'site', 'post'
    target_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
```

### Alteração na Tabela `profiles`

```sql
-- Adicionar campo para suspensão
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
```

---

## 📅 Fases de Implementação

### Fase 1: Essencial (MVP Admin) - 8-12 horas

> Objetivo: Ter visibilidade básica da plataforma

| Item | Descrição | Tempo |
|------|-----------|-------|
| Middleware admin | Verificar role antes de acessar `/admin` | 1h |
| Tabela admin_roles | Migration + seed inicial | 30min |
| Layout admin | Sidebar, header, estrutura | 2h |
| Dashboard métricas | Total usuários, sites, posts | 2h |
| Lista de usuários | Tabela com busca e paginação | 3h |
| Lista de sites | Tabela com status e links | 2h |

**Entregáveis:**
- [ ] `/admin` com dashboard de métricas
- [ ] `/admin/usuarios` com lista e busca
- [ ] `/admin/sites` com lista e status

---

### Fase 2: Operacional - 6-8 horas

> Objetivo: Poder moderar e gerenciar

| Item | Descrição | Tempo |
|------|-----------|-------|
| Detalhes do usuário | `/admin/usuarios/[id]` com todos dados | 2h |
| Suspender usuário | Botão + motivo + log | 1h |
| Detalhes do site | `/admin/sites/[id]` com preview | 2h |
| Forçar despublicação | Tirar site do ar | 1h |
| Logs de auditoria | Tabela admin_logs | 2h |

**Entregáveis:**
- [ ] Ações de moderação funcionais
- [ ] Histórico de ações registrado

---

### Fase 3: Avançado - 10-15 horas

> Objetivo: Recursos avançados de gestão

| Item | Descrição | Tempo |
|------|-----------|-------|
| RBAC completo | Diferentes níveis de acesso | 3h |
| Impersonar usuário | Login como usuário para debug | 2h |
| Analytics agregado | Métricas totais da plataforma | 3h |
| Exportar dados | CSV de usuários/sites | 2h |
| Broadcast email | Enviar para todos usuários | 3h |
| Feature flags | Toggle de funcionalidades | 2h |

---

## 🔐 Segurança

### Middleware de Proteção

```typescript
// middleware.ts - adicionar verificação admin
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    if (pathname.startsWith('/admin')) {
        const supabase = createMiddlewareClient({ req: request, res: response });
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // Verificar se é admin
        const { data: adminRole } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
            
        if (!adminRole) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
}
```

### Checklist de Segurança

- [ ] Verificar role em TODAS as Server Actions do admin
- [ ] Rate limiting nas APIs admin
- [ ] Logs de todas as ações sensíveis
- [ ] Não expor dados sensíveis (senhas, tokens)
- [ ] Audit trail para compliance

---

## 📁 Estrutura de Arquivos

```
src/app/admin/
├── layout.tsx              # Layout com sidebar admin
├── page.tsx                # Dashboard principal
├── loading.tsx             # Skeleton loading
├── usuarios/
│   ├── page.tsx           # Lista de usuários
│   └── [id]/
│       └── page.tsx       # Detalhes do usuário
├── sites/
│   ├── page.tsx           # Lista de sites
│   └── [id]/
│       └── page.tsx       # Detalhes do site
├── analytics/
│   └── page.tsx           # Métricas agregadas
├── logs/
│   └── page.tsx           # Logs de auditoria
└── configuracoes/
    └── page.tsx           # Settings

src/components/admin/
├── admin-sidebar.tsx       # Navegação lateral
├── admin-header.tsx        # Header com user info
├── users-table.tsx         # Tabela de usuários
├── sites-table.tsx         # Tabela de sites
├── stats-cards.tsx         # Cards de métricas
└── action-buttons.tsx      # Botões de ação (suspender, etc)

src/lib/admin/
├── actions.ts              # Server Actions do admin
├── queries.ts              # Queries Supabase
└── permissions.ts          # Helpers de permissão
```

---

## 🚀 Quick Start

### 1. Criar primeira entry de super_admin

```sql
-- Executar no Supabase SQL Editor após criar sua conta
INSERT INTO admin_roles (user_id, role)
VALUES ('SEU_USER_ID_AQUI', 'super_admin');
```

### 2. Criar migration

```bash
# Criar arquivo de migration
touch supabase/migrations/20241219000000_admin_module.sql
```

### 3. Rodar migration local

```bash
npx supabase db push
```

---

## 📊 Métricas do Dashboard Admin

### KPIs Principais

| Métrica | Query |
|---------|-------|
| Total de usuários | `SELECT COUNT(*) FROM profiles` |
| Usuários ativos (7d) | `SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '7 days'` |
| Sites publicados | `SELECT COUNT(*) FROM sites WHERE is_published = true` |
| Posts do blog | `SELECT COUNT(*) FROM blog_posts` |
| Page views (mês) | `SELECT SUM(page_views) FROM site_analytics WHERE date > NOW() - INTERVAL '30 days'` |

### Gráficos

- Novos cadastros por dia (últimos 30 dias)
- Sites publicados por semana
- Top 10 sites por page views

---

## ✅ Checklist de Implementação

### Fase 1 (Essencial)
- [ ] Migration `admin_roles` e `admin_logs`
- [ ] Middleware de proteção `/admin`
- [ ] Layout admin com sidebar
- [ ] Dashboard com métricas básicas
- [ ] Lista de usuários
- [ ] Lista de sites

### Fase 2 (Operacional)
- [ ] Página de detalhes do usuário
- [ ] Ação: Suspender usuário
- [ ] Página de detalhes do site
- [ ] Ação: Despublicar site
- [ ] Página de logs

### Fase 3 (Avançado)
- [ ] RBAC com múltiplos roles
- [ ] Impersonar usuário
- [ ] Exportar CSV
- [ ] Broadcast email
- [ ] Feature flags

---

## 🔗 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [TanStack Table](https://tanstack.com/table)
- [shadcn/ui](https://ui.shadcn.com)
