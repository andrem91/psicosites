-- =============================================
-- Migração Inicial - Schema Base do PsiBuilder
-- Data: 2024-12-01 (Atualizado: 2024-12-14)
-- 
-- NOTA: Políticas RLS otimizadas para performance
-- =============================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- 1. CRIAR TODAS AS TABELAS
-- ======================

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    whatsapp TEXT DEFAULT '',
    crp TEXT DEFAULT '',
    specialties TEXT[] DEFAULT '{}',
    bio TEXT DEFAULT '',
    bio_short TEXT DEFAULT '',
    profile_image_url TEXT,
    logo_url TEXT,
    online_service BOOLEAN DEFAULT TRUE,
    in_person_service BOOLEAN DEFAULT FALSE,
    street TEXT DEFAULT '',
    street_number TEXT DEFAULT '',
    neighborhood TEXT DEFAULT '',
    complement TEXT DEFAULT '',
    city TEXT DEFAULT '',
    state TEXT DEFAULT '',
    zip_code TEXT DEFAULT '',
    google_maps_embed TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_crp ON profiles(crp);

-- SITES
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
    show_ethics_section BOOLEAN DEFAULT TRUE,
    ethics_content TEXT DEFAULT '',
    show_lgpd_section BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_profile_id ON sites(profile_id);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON sites(subdomain);
CREATE INDEX IF NOT EXISTS idx_sites_custom_domain ON sites(custom_domain);

-- SUBSCRIPTIONS
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- ======================
-- 2. HABILITAR RLS
-- ======================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ======================
-- 3. FUNÇÕES HELPER (antes das políticas)
-- ======================

-- Função para verificar se perfil é público (evita recursão)
CREATE OR REPLACE FUNCTION public.is_profile_public(profile_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM sites 
        WHERE profile_id = profile_uuid 
        AND is_published = true
    );
$$;

-- ======================
-- 4. POLÍTICAS RLS (otimizadas - uma por ação)
-- ======================

-- PROFILES: Uma única política SELECT combinada (evita warning de múltiplas políticas)
CREATE POLICY "profiles_select"
    ON profiles FOR SELECT
    USING (
        (select auth.uid()) = user_id 
        OR public.is_profile_public(id)
    );

CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    USING ((select auth.uid()) = user_id);

CREATE POLICY "profiles_insert_own"
    ON profiles FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

-- SITES: Políticas otimizadas
CREATE POLICY "sites_select"
    ON sites FOR SELECT
    USING (
        is_published = true 
        OR profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );

CREATE POLICY "sites_insert_own"
    ON sites FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid())));

CREATE POLICY "sites_update_own"
    ON sites FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid())));

CREATE POLICY "sites_delete_own"
    ON sites FOR DELETE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid())));

-- SUBSCRIPTIONS
CREATE POLICY "subscriptions_select_own"
    ON subscriptions FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "subscriptions_update_own"
    ON subscriptions FOR UPDATE
    USING ((select auth.uid()) = user_id);

-- ======================
-- 5. FUNÇÕES E TRIGGERS
-- ======================

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

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- 6. TRIGGER AUTO-CREATE PROFILE
-- ======================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Psicólogo'),
        NEW.email
    );
    
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
