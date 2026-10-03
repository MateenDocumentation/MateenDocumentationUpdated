-- ============================================================
-- Mateen Documentation CMS — Phase 3 Migration
-- Run AFTER 001_cms_mateen.sql
-- Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Expand seo_settings with full Rank Math-level fields ──
ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS og_title          TEXT,
  ADD COLUMN IF NOT EXISTS og_description    TEXT,
  ADD COLUMN IF NOT EXISTS og_image          TEXT,
  ADD COLUMN IF NOT EXISTS twitter_title     TEXT,
  ADD COLUMN IF NOT EXISTS twitter_description TEXT,
  ADD COLUMN IF NOT EXISTS twitter_image     TEXT,
  ADD COLUMN IF NOT EXISTS sitemap_include   BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS schema_type       TEXT NOT NULL DEFAULT 'WebPage',
  ADD COLUMN IF NOT EXISTS custom_jsonld     TEXT,
  ADD COLUMN IF NOT EXISTS noindex           BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS nofollow          BOOLEAN NOT NULL DEFAULT FALSE;

-- Sync robots column from noindex/nofollow (computed helper view)
CREATE OR REPLACE VIEW public.seo_settings_computed AS
SELECT
  *,
  CASE
    WHEN noindex AND nofollow THEN 'noindex,nofollow'
    WHEN noindex AND NOT nofollow THEN 'noindex,follow'
    WHEN NOT noindex AND nofollow THEN 'index,nofollow'
    ELSE 'index,follow'
  END AS computed_robots
FROM public.seo_settings;

-- ─── Expand custom_scripts with placement + description ────
ALTER TABLE public.custom_scripts
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS priority     INTEGER NOT NULL DEFAULT 10;

-- Update location constraint to support Phase 3 placement names
ALTER TABLE public.custom_scripts
  DROP CONSTRAINT IF EXISTS custom_scripts_location_check;
ALTER TABLE public.custom_scripts
  ADD CONSTRAINT custom_scripts_location_check
  CHECK (location IN ('head_start', 'head_end', 'body_start', 'body_end'));

-- Migrate existing location values to new naming
UPDATE public.custom_scripts SET location = 'head_end'   WHERE location = 'head';
UPDATE public.custom_scripts SET location = 'body_start' WHERE location = 'body_start';
UPDATE public.custom_scripts SET location = 'body_end'   WHERE location = 'body_end';

-- ─── Expand redirects with 308 + description ───────────────
ALTER TABLE public.redirects
  DROP CONSTRAINT IF EXISTS redirects_status_code_check;
ALTER TABLE public.redirects
  ADD CONSTRAINT redirects_status_code_check
  CHECK (status_code IN (301, 302, 308));

ALTER TABLE public.redirects
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS hit_count   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ─── NEW: custom_meta_tags ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_meta_tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT,              -- meta name="..."
  property   TEXT,              -- meta property="..."
  content    TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT at_least_one_attr CHECK (name IS NOT NULL OR property IS NOT NULL)
);

-- ─── NEW: custom_css ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_css (
  id         TEXT PRIMARY KEY DEFAULT '1',
  css        TEXT NOT NULL DEFAULT '',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RLS for new tables ────────────────────────────────────
ALTER TABLE public.custom_meta_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_css       ENABLE ROW LEVEL SECURITY;

-- custom_meta_tags: public read, SUPER_ADMIN write
DROP POLICY IF EXISTS "Public read active meta tags" ON public.custom_meta_tags;
CREATE POLICY "Public read active meta tags" ON public.custom_meta_tags
  FOR SELECT USING (is_active = TRUE OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages meta tags" ON public.custom_meta_tags;
CREATE POLICY "Super admin manages meta tags" ON public.custom_meta_tags
  FOR ALL USING (public.is_super_admin());

-- custom_css: public read, SUPER_ADMIN write
DROP POLICY IF EXISTS "Public read active css" ON public.custom_css;
CREATE POLICY "Public read active css" ON public.custom_css
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Super admin manages custom css" ON public.custom_css;
CREATE POLICY "Super admin manages custom css" ON public.custom_css
  FOR ALL USING (public.is_super_admin());

-- ─── Seed: default custom_css row ──────────────────────────
INSERT INTO public.custom_css (id, css, is_active)
VALUES ('1', '', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Update SEO seed data with Phase 3 fields ──────────────
UPDATE public.seo_settings SET
  sitemap_include = TRUE,
  schema_type     = 'WebPage',
  noindex         = FALSE,
  nofollow        = FALSE
WHERE noindex IS NULL;

-- Admin routes: noindex
UPDATE public.seo_settings SET noindex = TRUE, nofollow = TRUE, sitemap_include = FALSE
WHERE page_slug = '/admin';

-- ─── Seed seo_settings for service pages (if not already present) ─
INSERT INTO public.seo_settings (page_slug, title, description, robots, sitemap_include, schema_type, noindex, nofollow) VALUES
  ('/services/printing-photocopy',               'Printing & Photocopy Services | Mateen Documentation',    'Professional printing and photocopying in North Nazimabad, Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/student-assignment-services',       'Student & Assignment Services | Mateen Documentation',    'Academic printing, binding and formatting services for students in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/customized-printing',              'Customized Printing Services | Mateen Documentation',     'Custom banners, flex, brochures and personalised print materials in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/cards-photo-frames',               'PVC Cards & Photo Frames | Mateen Documentation',         'ID cards, visiting cards, laminated cards and custom photo frames in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/design-branding',                  'Design & Branding Services | Mateen Documentation',       'Graphic design, logo creation and brand identity materials in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/stationery',                       'Office & School Stationery | Mateen Documentation',       'Stationery supplies for offices and educational institutions in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/legal-documentation',             'Legal Documentation Services | Mateen Documentation',     'Affidavits, legal notices, court documents and official paperwork in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/nadra-biometric-public-facilitation', 'NADRA & Biometric Services | Mateen Documentation',  'NADRA services, biometric verification and government form facilitation in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/vehicle-documentation',            'Vehicle Documentation Services | Mateen Documentation',   'Vehicle registration, ownership transfer and related documentation in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/business-documentation',           'Business Documentation Services | Mateen Documentation',  'Business registration, company documentation and corporate paperwork in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/insurance-facilitation',           'Insurance Facilitation Services | Mateen Documentation',  'Insurance form processing, claims documentation and policy paperwork in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE),
  ('/services/bulk-printing',                    'Bulk Printing Services | Mateen Documentation',           'High-volume printing services at competitive rates for businesses in Karachi.', 'index,follow', TRUE, 'Service', FALSE, FALSE)
ON CONFLICT (page_slug) DO NOTHING;

-- ============================================================
-- After running this migration:
-- Custom scripts, meta tags, and CSS are SUPER_ADMIN only.
-- The custom_css and custom_meta_tags tables feed into the
-- build-time prerender pipeline (Phase 4).
-- ============================================================
