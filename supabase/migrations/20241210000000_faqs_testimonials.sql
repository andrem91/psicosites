-- =============================================
-- Migração: FAQs e Depoimentos
-- Data: 2024-12-10
-- 
-- Cria tabelas: site_faqs, site_testimonials
-- OTIMIZADO: Usa (select auth.uid()) para melhor performance
-- =============================================

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

-- RLS
ALTER TABLE site_faqs ENABLE ROW LEVEL SECURITY;

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

-- Trigger updated_at
CREATE TRIGGER update_site_faqs_updated_at
    BEFORE UPDATE ON site_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- RLS
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

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

-- Trigger updated_at
CREATE TRIGGER update_site_testimonials_updated_at
    BEFORE UPDATE ON site_testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
