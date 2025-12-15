-- =============================================
-- Migração: Analytics e Blog
-- Data: 2024-12-05
-- 
-- Cria tabelas: site_analytics, blog_posts
-- OTIMIZADO: Usa (select auth.uid()) para melhor performance
-- =============================================

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

-- RLS
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

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

-- RLS
ALTER TABLE site_referrers ENABLE ROW LEVEL SECURITY;

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

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

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

-- Trigger updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
