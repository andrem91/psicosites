-- Migration: Remove extras columns (simplification)
-- Removes unused fields: video_url, working_hours, languages, target_audience, methodologies, certifications, pricing, instagram_url

-- Remove columns
ALTER TABLE profiles DROP COLUMN IF EXISTS video_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS working_hours;
ALTER TABLE profiles DROP COLUMN IF EXISTS languages;
ALTER TABLE profiles DROP COLUMN IF EXISTS target_audience;
ALTER TABLE profiles DROP COLUMN IF EXISTS methodologies;
ALTER TABLE profiles DROP COLUMN IF EXISTS certifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS pricing;
ALTER TABLE profiles DROP COLUMN IF EXISTS instagram_url;

-- Remove indexes
DROP INDEX IF EXISTS idx_profiles_languages;
DROP INDEX IF EXISTS idx_profiles_target_audience;
DROP INDEX IF EXISTS idx_profiles_methodologies;
