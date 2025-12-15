-- =============================================
-- Seed: Dados de Exemplo para Desenvolvimento
-- 
-- Use: npx supabase db reset (aplica migrations + seed)
-- =============================================

-- Nota: Este arquivo NÃO cria usuários auth
-- Os dados de exemplo dependem de um usuário já existente

-- Exemplo de como seria um perfil completo (comentado):
-- INSERT INTO profiles (id, user_id, full_name, email, crp, whatsapp, specialties, bio)
-- VALUES (
--     'example-profile-id',
--     'auth-user-id-here',
--     'Dra. Maria Santos',
--     'maria@example.com',
--     '06/12345',
--     '11999998888',
--     ARRAY['Ansiedade', 'Depressão', 'Terapia de Casal'],
--     '<p>Psicóloga clínica com 10 anos de experiência...</p>'
-- );

-- FAQs padrão que serão inseridas automaticamente pelo onboarding
-- Estas são as perguntas recomendadas para novos psicólogos
