-- =============================================
-- PsiBuilder - Schema do Banco de Dados
-- Versão: 2.0 (Consolidado)
-- Data: Dezembro 2024
-- 
-- Inclui: Tabelas, Índices, RLS, Triggers
-- Removido: content_library (simplificação MVP)
-- =============================================

-- ======================
-- EXTENSÕES
-- ======================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- TABELA: PROFILES
-- Dados do psicólogo
-- ======================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    whatsapp TEXT DEFAULT '',
    crp TEXT DEFAULT '',
    specialties TEXT[] DEFAULT '{}',
    bio TEXT DEFAULT '',
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_crp ON profiles(crp);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON profiles FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON profiles FOR UPDATE
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Usuários podem criar seu próprio perfil"
    ON profiles FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

-- Perfis de sites publicados são visíveis publicamente (para visitantes anônimos)
CREATE POLICY "Perfis de sites publicados são visíveis"
    ON profiles FOR SELECT
    USING (
        id IN (SELECT profile_id FROM sites WHERE is_published = true)
    );

-- ======================
-- TABELA: SITES
-- Configuração do site do psicólogo
-- ======================
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    subdomain TEXT UNIQUE NOT NULL,
    custom_domain TEXT UNIQUE,
    is_published BOOLEAN DEFAULT FALSE,
    site_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    theme_config JSONB DEFAULT '{"primaryColor": "#6366f1", "backgroundColor": "#ffffff", "fontFamily": "Inter"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sites_profile_id ON sites(profile_id);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON sites(subdomain);
CREATE INDEX IF NOT EXISTS idx_sites_custom_domain ON sites(custom_domain);

-- RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- SELECT: Sites publicados são públicos OU próprio usuário pode ver
CREATE POLICY "Acesso a sites"
    ON sites FOR SELECT
    USING (
        is_published = true 
        OR (select auth.uid()) = (SELECT user_id FROM profiles WHERE id = profile_id)
    );

-- INSERT: Apenas próprio usuário
CREATE POLICY "Usuários podem criar site"
    ON sites FOR INSERT
    WITH CHECK ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = profile_id));

-- UPDATE: Apenas próprio usuário
CREATE POLICY "Usuários podem atualizar site"
    ON sites FOR UPDATE
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = profile_id));

-- DELETE: Apenas próprio usuário
CREATE POLICY "Usuários podem deletar site"
    ON sites FOR DELETE
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = profile_id));

-- ======================
-- TABELA: SUBSCRIPTIONS
-- Assinaturas e planos (integração Asaas)
-- ======================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'cancelled')),
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_customer ON subscriptions(asaas_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_subscription ON subscriptions(asaas_subscription_id);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso a assinaturas"
    ON subscriptions FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Usuários podem atualizar assinatura"
    ON subscriptions FOR UPDATE
    USING ((select auth.uid()) = user_id);

-- ======================
-- TABELA: SITE_ANALYTICS
-- Métricas diárias do site
-- ======================
CREATE TABLE IF NOT EXISTS site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON site_analytics(site_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_date ON site_analytics(date);

-- RLS
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver analytics do seu site"
    ON site_analytics FOR SELECT
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- TABELA: BLOG_POSTS
-- Artigos do blog do psicólogo
-- ======================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, slug)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blog_posts_site_id ON blog_posts(site_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- SELECT: Posts publicados OU próprio usuário
CREATE POLICY "Acesso a posts"
    ON blog_posts FOR SELECT
    USING (
        is_published = true OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- INSERT
CREATE POLICY "Usuários podem criar posts"
    ON blog_posts FOR INSERT
    WITH CHECK (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- UPDATE
CREATE POLICY "Usuários podem atualizar posts"
    ON blog_posts FOR UPDATE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- DELETE
CREATE POLICY "Usuários podem deletar posts"
    ON blog_posts FOR DELETE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- TABELA: FAQ_ITEMS
-- Perguntas frequentes do site
-- ======================
CREATE TABLE IF NOT EXISTS faq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_faq_items_site_id ON faq_items(site_id);

-- RLS
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- SELECT: FAQ público para sites publicados OU próprio usuário
CREATE POLICY "Acesso a FAQ"
    ON faq_items FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE is_published = true) OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- INSERT
CREATE POLICY "Usuários podem criar FAQ"
    ON faq_items FOR INSERT
    WITH CHECK (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- UPDATE
CREATE POLICY "Usuários podem atualizar FAQ"
    ON faq_items FOR UPDATE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- DELETE
CREATE POLICY "Usuários podem deletar FAQ"
    ON faq_items FOR DELETE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- FUNÇÕES E TRIGGERS
-- ======================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
    BEFORE UPDATE ON faq_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- TRIGGER: AUTO-CREATE PROFILE E SUBSCRIPTION
-- Quando um novo usuário é criado no Auth
-- ======================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Criar perfil básico
    INSERT INTO public.profiles (user_id, full_name, email, whatsapp, crp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Psicólogo'),
        NEW.email,
        '',
        ''
    );
    
    -- Criar assinatura gratuita
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger no auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ======================
-- FIM DO SCHEMA
-- ======================
