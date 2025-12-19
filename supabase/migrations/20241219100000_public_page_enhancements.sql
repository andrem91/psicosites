-- Migration: Add optional public page enhancement fields
-- These fields enhance the public psychologist page with additional optional information

-- Vídeo de apresentação (YouTube/Vimeo URL)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';

-- Horários de atendimento (formato livre)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT '';

-- Idiomas de atendimento
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';

-- Público-alvo
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}';

-- Metodologias/Abordagens detalhadas (além do campo approach existente)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS methodologies TEXT[] DEFAULT '{}';

-- Certificações e Formações (JSONB para estrutura flexível)
-- Formato: [{ "title": "Especialização em TCC", "institution": "USP", "year": "2020" }]
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;

-- Preços/Valores (JSONB para estrutura flexível)
-- Formato: [{ "service": "Sessão Individual", "price": "200", "duration": "50min" }]
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '[]'::jsonb;

-- Instagram URL separado para botão flutuante
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';

-- Índices para campos que podem ser usados em buscas
CREATE INDEX IF NOT EXISTS idx_profiles_languages ON profiles USING GIN (languages);
CREATE INDEX IF NOT EXISTS idx_profiles_target_audience ON profiles USING GIN (target_audience);
CREATE INDEX IF NOT EXISTS idx_profiles_methodologies ON profiles USING GIN (methodologies);
