-- =============================================
-- Migração: Storage Buckets
-- Data: 2024-12-14
-- 
-- Cria bucket para imagens de perfil e logo
-- Configura políticas RLS para storage
-- =============================================

-- ======================
-- 1. CRIAR BUCKET
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
-- 2. POLÍTICAS DE STORAGE
-- ======================

-- Permitir leitura pública (imagens são públicas)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
);

-- Permitir que usuários atualizem suas próprias imagens
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários deletem suas próprias imagens
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
