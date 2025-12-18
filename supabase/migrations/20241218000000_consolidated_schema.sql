-- =============================================
-- PsiBuilder - Schema Consolidado
-- Data: Dezembro 2024
--
-- Consolidação de todas as migrations em um único arquivo
-- Inclui: profiles, sites, subscriptions, analytics, blog,
--         faqs, testimonials, storage, specialties_data, show_blog
--
-- NOTA: Políticas RLS otimizadas com (select auth.uid())
-- =============================================

-- ======================
-- EXTENSÕES
-- ======================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- TABELA: PROFILES
-- ======================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    whatsapp TEXT DEFAULT '',
    crp TEXT DEFAULT '',
    specialties TEXT[] DEFAULT '{}',
    specialties_data JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_profiles_specialties_data ON profiles USING GIN (specialties_data);

-- ======================
-- TABELA: SITES
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
    show_ethics_section BOOLEAN DEFAULT TRUE,
    ethics_content TEXT DEFAULT '',
    show_lgpd_section BOOLEAN DEFAULT TRUE,
    show_blog BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_profile_id ON sites(profile_id);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON sites(subdomain);
CREATE INDEX IF NOT EXISTS idx_sites_custom_domain ON sites(custom_domain);

-- ======================
-- TABELA: SUBSCRIPTIONS
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- ======================
-- TABELA: SITE_ANALYTICS
-- ======================
CREATE TABLE IF NOT EXISTS site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    cta_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, date)
);

CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON site_analytics(site_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_date ON site_analytics(date);

-- ======================
-- TABELA: SITE_REFERRERS
-- ======================
CREATE TABLE IF NOT EXISTS site_referrers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    referrer_source TEXT NOT NULL,
    visit_count INTEGER DEFAULT 1,
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, referrer_source)
);

CREATE INDEX IF NOT EXISTS idx_site_referrers_site_id ON site_referrers(site_id);

-- ======================
-- TABELA: BLOG_POSTS
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

CREATE INDEX IF NOT EXISTS idx_blog_posts_site_id ON blog_posts(site_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ======================
-- TABELA: SITE_FAQS
-- ======================
CREATE TABLE IF NOT EXISTS site_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_faqs_site_id ON site_faqs(site_id);

-- ======================
-- TABELA: SITE_TESTIMONIALS
-- ======================
CREATE TABLE IF NOT EXISTS site_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    author_initials TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_testimonials_site_id ON site_testimonials(site_id);

-- ======================
-- HABILITAR RLS
-- ======================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_referrers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

-- ======================
-- FUNÇÕES HELPER
-- ======================
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

-- ======================
-- POLÍTICAS RLS: PROFILES
-- ======================
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

-- ======================
-- POLÍTICAS RLS: SITES
-- ======================
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

-- ======================
-- POLÍTICAS RLS: SUBSCRIPTIONS
-- ======================
CREATE POLICY "subscriptions_select_own"
    ON subscriptions FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "subscriptions_update_own"
    ON subscriptions FOR UPDATE
    USING ((select auth.uid()) = user_id);

-- ======================
-- POLÍTICAS RLS: SITE_ANALYTICS
-- ======================
CREATE POLICY "analytics_select_own"
    ON site_analytics FOR SELECT
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "analytics_insert_public"
    ON site_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_update_public"
    ON site_analytics FOR UPDATE USING (true);

-- ======================
-- POLÍTICAS RLS: SITE_REFERRERS
-- ======================
CREATE POLICY "referrers_select_own"
    ON site_referrers FOR SELECT
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "referrers_insert_public"
    ON site_referrers FOR INSERT WITH CHECK (true);

CREATE POLICY "referrers_update_public"
    ON site_referrers FOR UPDATE USING (true);

-- ======================
-- POLÍTICAS RLS: BLOG_POSTS
-- ======================
CREATE POLICY "blog_select_public"
    ON blog_posts FOR SELECT
    USING (
        is_published = true OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "blog_insert_own"
    ON blog_posts FOR INSERT
    WITH CHECK (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "blog_update_own"
    ON blog_posts FOR UPDATE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "blog_delete_own"
    ON blog_posts FOR DELETE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- POLÍTICAS RLS: SITE_FAQS
-- ======================
CREATE POLICY "faqs_select"
    ON site_faqs FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE is_published = true) OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "faqs_insert_own"
    ON site_faqs FOR INSERT
    WITH CHECK (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "faqs_update_own"
    ON site_faqs FOR UPDATE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "faqs_delete_own"
    ON site_faqs FOR DELETE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- POLÍTICAS RLS: SITE_TESTIMONIALS
-- ======================
CREATE POLICY "testimonials_select"
    ON site_testimonials FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE is_published = true) OR
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "testimonials_insert_own"
    ON site_testimonials FOR INSERT
    WITH CHECK (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "testimonials_update_own"
    ON site_testimonials FOR UPDATE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

CREATE POLICY "testimonials_delete_own"
    ON site_testimonials FOR DELETE
    USING (
        site_id IN (
            SELECT s.id FROM sites s
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.user_id = (select auth.uid())
        )
    );

-- ======================
-- TRIGGERS: UPDATED_AT
-- ======================
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

CREATE TRIGGER update_site_faqs_updated_at
    BEFORE UPDATE ON site_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_testimonials_updated_at
    BEFORE UPDATE ON site_testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- TRIGGER: AUTO-CREATE PROFILE
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

-- ======================
-- STORAGE: PROFILE IMAGES BUCKET
-- ======================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    true,
    10485760,  -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ======================
-- POLÍTICAS STORAGE
-- ======================
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ======================
-- FIM DO SCHEMA CONSOLIDADO
-- ======================
