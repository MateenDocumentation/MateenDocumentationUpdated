-- 005_media_source_url.sql
-- Adds the original source URL used by the website so imported media can
-- transparently replace hardcoded external image URLs after deployment.

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS source_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS media_assets_source_url_unique
  ON public.media_assets (source_url)
  WHERE source_url IS NOT NULL;
