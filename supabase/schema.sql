-- =============================================
-- PsiBuilder Database Schema
-- Versão: 1.0
-- =============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: profiles
-- Dados do psicólogo
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    crp TEXT NOT NULL,
    crp_verified BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    bio TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    approach TEXT NOT NULL DEFAULT 'integrativa',
    approach_description TEXT,
    city TEXT,
    state TEXT,
    online_service BOOLEAN DEFAULT TRUE,
    in_person_service BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca por CRP
CREATE INDEX idx_profiles_crp ON profiles(crp);

-- =============================================
-- TABELA: sites
-- Configuração do site do psicólogo
-- =============================================
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    subdomain TEXT NOT NULL UNIQUE,
    custom_domain TEXT UNIQUE,
    domain_verified BOOLEAN DEFAULT FALSE,
    theme_id TEXT DEFAULT 'default',
    primary_color TEXT DEFAULT '#6366f1',
    secondary_color TEXT DEFAULT '#8b5cf6',
    font_family TEXT DEFAULT 'Inter',
    hero_headline TEXT,
    hero_subheadline TEXT,
    about_text TEXT,
    show_blog BOOLEAN DEFAULT FALSE,
    show_faq BOOLEAN DEFAULT TRUE,
    ga_measurement_id TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para busca por domínio
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_sites_custom_domain ON sites(custom_domain);

-- =============================================
-- TABELA: subscriptions
-- Assinaturas e planos
-- =============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'authority', 'clinic')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca por Asaas IDs
CREATE INDEX idx_subscriptions_asaas_customer ON subscriptions(asaas_customer_id);
CREATE INDEX idx_subscriptions_asaas_subscription ON subscriptions(asaas_subscription_id);

-- =============================================
-- TABELA: site_analytics
-- Métricas de cada site
-- =============================================
CREATE TABLE site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, date)
);

-- Index para consultas por data
CREATE INDEX idx_site_analytics_date ON site_analytics(site_id, date DESC);

-- =============================================
-- TABELA: blog_posts
-- Artigos do blog
-- =============================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, slug)
);

-- Index para busca por slug
CREATE INDEX idx_blog_posts_slug ON blog_posts(site_id, slug);

-- =============================================
-- TABELA: faq_items
-- Perguntas frequentes
-- =============================================
CREATE TABLE faq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: content_library
-- Biblioteca de conteúdos (textos modelo)
-- =============================================
CREATE TABLE content_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu próprio perfil"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Sites públicos podem ser visualizados por todos
CREATE POLICY "Sites publicados são públicos"
    ON sites FOR SELECT
    USING (is_published = true OR auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

CREATE POLICY "Usuários podem gerenciar seu site"
    ON sites FOR ALL
    USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

-- Políticas para subscriptions
CREATE POLICY "Usuários podem ver sua assinatura"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem gerenciar sua assinatura"
    ON subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- Políticas para analytics
CREATE POLICY "Usuários podem ver analytics do seu site"
    ON site_analytics FOR SELECT
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Políticas para blog_posts
CREATE POLICY "Posts publicados são públicos"
    ON blog_posts FOR SELECT
    USING (
        is_published = true OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem gerenciar posts do seu site"
    ON blog_posts FOR ALL
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Políticas para faq_items
CREATE POLICY "FAQ é público para sites publicados"
    ON faq_items FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE is_published = true) OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem gerenciar FAQ do seu site"
    ON faq_items FOR ALL
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Biblioteca de conteúdo é pública para leitura
CREATE POLICY "Biblioteca é pública para leitura"
    ON content_library FOR SELECT
    USING (is_active = true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas com updated_at
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

CREATE TRIGGER update_content_library_updated_at
    BEFORE UPDATE ON content_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNÇÃO: Criar perfil e assinatura ao registrar
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar perfil básico
    INSERT INTO profiles (user_id, full_name, email, whatsapp, crp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Psicólogo'),
        NEW.email,
        '',
        ''
    );
    
    -- Criar assinatura gratuita
    INSERT INTO subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
