-- ============================================================
-- Mateen Documentation CMS — Phase 1 + Phase 2 Migration
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Enable UUID extension ─────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  full_name    TEXT,
  role         TEXT NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('SUPER_ADMIN', 'EDITOR')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'EDITOR'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 2. SITE SETTINGS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id             TEXT PRIMARY KEY DEFAULT '1',
  business_name  TEXT NOT NULL DEFAULT 'Mateen Documentation',
  tagline        TEXT NOT NULL DEFAULT 'Where Printing Meets Documentation',
  phone          TEXT NOT NULL DEFAULT '+92 331 2478337',
  whatsapp       TEXT NOT NULL DEFAULT '+92 331 2478337',
  email          TEXT NOT NULL DEFAULT 'mateendocumentation@gmail.com',
  address        TEXT NOT NULL DEFAULT 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi',
  maps_url       TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6',
  logo_url       TEXT,
  favicon_url    TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 3. HEADER SETTINGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.header_settings (
  id          TEXT PRIMARY KEY DEFAULT '1',
  phone       TEXT NOT NULL DEFAULT '+92 331 2478337',
  whatsapp    TEXT NOT NULL DEFAULT '923312478337',
  cta_label   TEXT NOT NULL DEFAULT 'WhatsApp Us',
  cta_url     TEXT NOT NULL DEFAULT 'https://wa.me/923312478337',
  logo_url    TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. NAVIGATION ITEMS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label        TEXT NOT NULL,
  url          TEXT NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  has_dropdown BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 5. FOOTER SETTINGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id               TEXT PRIMARY KEY DEFAULT '1',
  tagline          TEXT NOT NULL DEFAULT 'Where Printing Meets Documentation',
  description      TEXT NOT NULL DEFAULT 'A multi-service printing, documentation, biometric and public facilitation centre in North Nazimabad, Karachi.',
  trusted_since    TEXT NOT NULL DEFAULT '2005',
  phone            TEXT NOT NULL DEFAULT '+92 331 2478337',
  whatsapp         TEXT NOT NULL DEFAULT '+92 331 2478337',
  email            TEXT NOT NULL DEFAULT 'mateendocumentation@gmail.com',
  address          TEXT NOT NULL DEFAULT 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi',
  maps_url         TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6',
  copyright_text   TEXT NOT NULL DEFAULT '© 2025 Mateen Documentation. All Rights Reserved.',
  developer_credit TEXT NOT NULL DEFAULT 'BrandBugs',
  developer_url    TEXT NOT NULL DEFAULT 'https://www.brandbugs.net',
  service_links    JSONB NOT NULL DEFAULT '[]',
  quick_links      JSONB NOT NULL DEFAULT '[]',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 6. PAGES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  status       TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  is_protected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 7. PAGE SECTIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  label       TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  content     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 8. MEDIA ASSETS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_assets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL UNIQUE,
  public_url    TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('image', 'video', 'svg')),
  mime_type     TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL DEFAULT 0,
  width         INTEGER,
  height        INTEGER,
  alt_text      TEXT,
  title         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 9. SERVICES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  tag         TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  slug        TEXT NOT NULL UNIQUE,
  image_url   TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 10. SEO SETTINGS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug     TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  canonical_url TEXT,
  og_image      TEXT,
  robots        TEXT NOT NULL DEFAULT 'index,follow',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 11. REDIRECTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.redirects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_path   TEXT NOT NULL UNIQUE,
  to_path     TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 12. CUSTOM SCRIPTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_scripts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  location   TEXT NOT NULL CHECK (location IN ('head', 'body_start', 'body_end')),
  content    TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 13. CONTENT VERSIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_versions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id  TEXT NOT NULL,
  snapshot   JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 14. AUDIT LOGS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id),
  user_email TEXT,
  action     TEXT NOT NULL,
  table_name TEXT,
  record_id  TEXT,
  details    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.header_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: check role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_cms_user()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'EDITOR'));
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN');
$$;

-- ─── profiles ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admin reads all profiles" ON public.profiles;
CREATE POLICY "Super admin reads all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

DROP POLICY IF EXISTS "User can update own profile" ON public.profiles;
CREATE POLICY "User can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admin updates any profile" ON public.profiles;
CREATE POLICY "Super admin updates any profile" ON public.profiles
  FOR UPDATE USING (public.is_super_admin());

-- ─── site_settings (public read, cms write) ───────────────
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "CMS users update site_settings" ON public.site_settings;
CREATE POLICY "CMS users update site_settings" ON public.site_settings
  FOR ALL USING (public.is_cms_user());

-- ─── header_settings ──────────────────────────────────────
DROP POLICY IF EXISTS "Public read header_settings" ON public.header_settings;
CREATE POLICY "Public read header_settings" ON public.header_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "CMS users manage header_settings" ON public.header_settings;
CREATE POLICY "CMS users manage header_settings" ON public.header_settings
  FOR ALL USING (public.is_cms_user());

-- ─── navigation_items (public read, cms write) ────────────
DROP POLICY IF EXISTS "Public read enabled navigation" ON public.navigation_items;
CREATE POLICY "Public read enabled navigation" ON public.navigation_items
  FOR SELECT USING (is_enabled = TRUE OR public.is_cms_user());

DROP POLICY IF EXISTS "CMS users manage navigation" ON public.navigation_items;
CREATE POLICY "CMS users manage navigation" ON public.navigation_items
  FOR ALL USING (public.is_cms_user());

-- ─── footer_settings ──────────────────────────────────────
DROP POLICY IF EXISTS "Public read footer_settings" ON public.footer_settings;
CREATE POLICY "Public read footer_settings" ON public.footer_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "CMS users manage footer_settings" ON public.footer_settings;
CREATE POLICY "CMS users manage footer_settings" ON public.footer_settings
  FOR ALL USING (public.is_cms_user());

-- ─── pages (public read published, cms write) ─────────────
DROP POLICY IF EXISTS "Public read published pages" ON public.pages;
CREATE POLICY "Public read published pages" ON public.pages
  FOR SELECT USING (status = 'published' OR public.is_cms_user());

DROP POLICY IF EXISTS "CMS users manage pages" ON public.pages;
CREATE POLICY "CMS users manage pages" ON public.pages
  FOR ALL USING (public.is_cms_user());

-- ─── page_sections ────────────────────────────────────────
DROP POLICY IF EXISTS "Public read visible sections" ON public.page_sections;
CREATE POLICY "Public read visible sections" ON public.page_sections
  FOR SELECT USING (is_visible = TRUE OR public.is_cms_user());

DROP POLICY IF EXISTS "CMS users manage sections" ON public.page_sections;
CREATE POLICY "CMS users manage sections" ON public.page_sections
  FOR ALL USING (public.is_cms_user());

-- ─── media_assets ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read media" ON public.media_assets;
CREATE POLICY "Public read media" ON public.media_assets
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "CMS users manage media" ON public.media_assets;
CREATE POLICY "CMS users manage media" ON public.media_assets
  FOR ALL USING (public.is_cms_user());

-- ─── services ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services" ON public.services
  FOR SELECT USING (is_active = TRUE OR public.is_cms_user());

DROP POLICY IF EXISTS "CMS users manage services" ON public.services;
CREATE POLICY "CMS users manage services" ON public.services
  FOR ALL USING (public.is_cms_user());

-- ─── seo_settings ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read seo" ON public.seo_settings;
CREATE POLICY "Public read seo" ON public.seo_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "CMS users manage seo" ON public.seo_settings;
CREATE POLICY "CMS users manage seo" ON public.seo_settings
  FOR ALL USING (public.is_cms_user());

-- ─── redirects ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read active redirects" ON public.redirects;
CREATE POLICY "Public read active redirects" ON public.redirects
  FOR SELECT USING (is_active = TRUE OR public.is_cms_user());

DROP POLICY IF EXISTS "Super admin manages redirects" ON public.redirects;
CREATE POLICY "Super admin manages redirects" ON public.redirects
  FOR ALL USING (public.is_super_admin());

-- ─── custom_scripts (SUPER_ADMIN only) ────────────────────
DROP POLICY IF EXISTS "Public read active scripts" ON public.custom_scripts;
CREATE POLICY "Public read active scripts" ON public.custom_scripts
  FOR SELECT USING (is_active = TRUE OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages scripts" ON public.custom_scripts;
CREATE POLICY "Super admin manages scripts" ON public.custom_scripts
  FOR ALL USING (public.is_super_admin());

-- ─── content_versions ─────────────────────────────────────
DROP POLICY IF EXISTS "CMS users read versions" ON public.content_versions;
CREATE POLICY "CMS users read versions" ON public.content_versions
  FOR SELECT USING (public.is_cms_user());

DROP POLICY IF EXISTS "CMS users insert versions" ON public.content_versions;
CREATE POLICY "CMS users insert versions" ON public.content_versions
  FOR INSERT WITH CHECK (public.is_cms_user());

-- ─── audit_logs ───────────────────────────────────────────
DROP POLICY IF EXISTS "CMS users read audit logs" ON public.audit_logs;
CREATE POLICY "CMS users read audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_cms_user());

DROP POLICY IF EXISTS "CMS users insert audit logs" ON public.audit_logs;
CREATE POLICY "CMS users insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_cms_user());

-- ============================================================
-- SUPABASE STORAGE — create cms-media bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-media',
  'cms-media',
  TRUE,
  52428800, -- 50 MB
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','video/mp4','video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read
DROP POLICY IF EXISTS "Public read cms-media" ON storage.objects;
CREATE POLICY "Public read cms-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');

-- Storage RLS: CMS users upload
DROP POLICY IF EXISTS "CMS users upload to cms-media" ON storage.objects;
CREATE POLICY "CMS users upload to cms-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND public.is_cms_user());

-- Storage RLS: CMS users delete
DROP POLICY IF EXISTS "CMS users delete from cms-media" ON storage.objects;
CREATE POLICY "CMS users delete from cms-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media' AND public.is_cms_user());

-- ============================================================
-- SEED DATA — current production content
-- ============================================================

-- Site settings
INSERT INTO public.site_settings (id, business_name, tagline, phone, whatsapp, email, address, maps_url)
VALUES (
  '1',
  'Mateen Documentation',
  'Where Printing Meets Documentation',
  '+92 331 2478337',
  '+92 331 2478337',
  'mateendocumentation@gmail.com',
  'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi',
  'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6'
)
ON CONFLICT (id) DO NOTHING;

-- Header settings
INSERT INTO public.header_settings (id, phone, whatsapp, cta_label, cta_url)
VALUES ('1', '+92 331 2478337', '923312478337', 'WhatsApp Us', 'https://wa.me/923312478337')
ON CONFLICT (id) DO NOTHING;

-- Footer settings
INSERT INTO public.footer_settings (
  id, tagline, description, trusted_since, phone, whatsapp, email, address, maps_url,
  copyright_text, developer_credit, developer_url, service_links, quick_links
) VALUES (
  '1',
  'Where Printing Meets Documentation',
  'A multi-service printing, documentation, biometric and public facilitation centre in North Nazimabad, Karachi.',
  '2005',
  '+92 331 2478337',
  '+92 331 2478337',
  'mateendocumentation@gmail.com',
  'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi',
  'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6',
  '© 2025 Mateen Documentation. All Rights Reserved.',
  'BrandBugs',
  'https://www.brandbugs.net',
  '[
    {"label": "Printing & Photocopy", "url": "/services/printing-photocopy", "enabled": true},
    {"label": "Student Assignments", "url": "/services/student-assignment-services", "enabled": true},
    {"label": "Customized Printing", "url": "/services/customized-printing", "enabled": true},
    {"label": "Biometric & NADRA", "url": "/services/nadra-biometric-public-facilitation", "enabled": true},
    {"label": "Legal Documentation", "url": "/services/legal-documentation", "enabled": true},
    {"label": "Business Documentation", "url": "/services/business-documentation", "enabled": true}
  ]'::jsonb,
  '[
    {"label": "Home", "url": "/", "enabled": true},
    {"label": "About Us", "url": "/about", "enabled": true},
    {"label": "All Services", "url": "/services", "enabled": true},
    {"label": "Order Online", "url": "/order-online", "enabled": true},
    {"label": "Contact", "url": "/contact", "enabled": true}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Navigation items
INSERT INTO public.navigation_items (label, url, order_index, is_enabled, has_dropdown, parent_id) VALUES
  ('Home', '/', 0, TRUE, FALSE, NULL),
  ('About', '/about', 1, TRUE, FALSE, NULL),
  ('Services', '/services', 2, TRUE, TRUE, NULL),
  ('Order Online', '/order-online', 3, TRUE, FALSE, NULL),
  ('Contact', '/contact', 4, TRUE, FALSE, NULL),
  -- Services dropdown
  ('Printing & Photocopy', '/services/printing-photocopy', 0, TRUE, FALSE, 'services'),
  ('Student & Assignment Services', '/services/student-assignment-services', 1, TRUE, FALSE, 'services'),
  ('Customized Printing', '/services/customized-printing', 2, TRUE, FALSE, 'services'),
  ('PVC Cards & Photo Frames', '/services/cards-photo-frames', 3, TRUE, FALSE, 'services'),
  ('Design & Branding', '/services/design-branding', 4, TRUE, FALSE, 'services'),
  ('Office & School Stationery', '/services/stationery', 5, TRUE, FALSE, 'services'),
  ('Legal Documentation', '/services/legal-documentation', 6, TRUE, FALSE, 'services'),
  ('NADRA / Biometric / Public Facilitation', '/services/nadra-biometric-public-facilitation', 7, TRUE, FALSE, 'services'),
  ('Vehicle Documentation', '/services/vehicle-documentation', 8, TRUE, FALSE, 'services'),
  ('Business Documentation', '/services/business-documentation', 9, TRUE, FALSE, 'services'),
  ('Insurance Facilitation', '/services/insurance-facilitation', 10, TRUE, FALSE, 'services'),
  ('Bulk Printing', '/services/bulk-printing', 11, TRUE, FALSE, 'services')
ON CONFLICT DO NOTHING;

-- Pages
INSERT INTO public.pages (name, slug, status, is_protected) VALUES
  ('Home', '/', 'published', TRUE),
  ('About', '/about', 'published', TRUE),
  ('Services', '/services', 'published', TRUE),
  ('Order Online', '/order-online', 'published', TRUE),
  ('Contact', '/contact', 'published', TRUE),
  ('Privacy Policy', '/privacy-policy', 'published', TRUE),
  ('Terms & Conditions', '/terms-and-conditions', 'published', TRUE),
  ('404 Not Found', '/404', 'published', TRUE),
  -- Service pages
  ('Printing & Photocopy', '/services/printing-photocopy', 'published', FALSE),
  ('Student & Assignment Services', '/services/student-assignment-services', 'published', FALSE),
  ('Customized Printing', '/services/customized-printing', 'published', FALSE),
  ('PVC Cards & Photo Frames', '/services/cards-photo-frames', 'published', FALSE),
  ('Design & Branding', '/services/design-branding', 'published', FALSE),
  ('Office & School Stationery', '/services/stationery', 'published', FALSE),
  ('Legal Documentation', '/services/legal-documentation', 'published', FALSE),
  ('NADRA / Biometric / Public Facilitation', '/services/nadra-biometric-public-facilitation', 'published', FALSE),
  ('Vehicle Documentation', '/services/vehicle-documentation', 'published', FALSE),
  ('Business Documentation', '/services/business-documentation', 'published', FALSE),
  ('Insurance Facilitation', '/services/insurance-facilitation', 'published', FALSE),
  ('Bulk Printing', '/services/bulk-printing', 'published', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- Services
INSERT INTO public.services (title, tag, description, slug, image_url, is_featured, order_index, is_active) VALUES
  ('Printing & Photocopy', 'Core Service', 'High-quality printing and photocopying services for all document types.', 'printing-photocopy', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&fit=crop&auto=format&q=80', TRUE, 0, TRUE),
  ('Student & Assignment Services', 'Academic', 'Printing, binding and formatting services for students and academic needs.', 'student-assignment-services', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&fit=crop&auto=format&q=80', TRUE, 1, TRUE),
  ('Customized Printing', 'Printing', 'Custom banners, flex, brochures, and personalized print materials.', 'customized-printing', 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&fit=crop&auto=format&q=80', FALSE, 2, TRUE),
  ('PVC Cards & Photo Frames', 'Specialty', 'ID cards, visiting cards, laminated cards, and custom photo frames.', 'cards-photo-frames', 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=800&fit=crop&auto=format&q=80', FALSE, 3, TRUE),
  ('Design & Branding', 'Creative', 'Graphic design, logo creation, and brand identity materials.', 'design-branding', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&fit=crop&auto=format&q=80', FALSE, 4, TRUE),
  ('Office & School Stationery', 'Stationery', 'Stationery supplies for offices and educational institutions.', 'stationery', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&fit=crop&auto=format&q=80', FALSE, 5, TRUE),
  ('Legal Documentation', 'Legal', 'Affidavits, legal notices, court documents, and official paperwork.', 'legal-documentation', 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&fit=crop&auto=format&q=80', FALSE, 6, TRUE),
  ('NADRA / Biometric / Public Facilitation', 'Government', 'NADRA services, biometric verification, and government form facilitation.', 'nadra-biometric-public-facilitation', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&fit=crop&auto=format&q=80', FALSE, 7, TRUE),
  ('Vehicle Documentation', 'Government', 'Vehicle registration, ownership transfer, and related documentation.', 'vehicle-documentation', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&fit=crop&auto=format&q=80', FALSE, 8, TRUE),
  ('Business Documentation', 'Business', 'Business registration, company documentation, and corporate paperwork.', 'business-documentation', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&fit=crop&auto=format&q=80', FALSE, 9, TRUE),
  ('Insurance Facilitation', 'Finance', 'Insurance form processing, claims documentation, and policy paperwork.', 'insurance-facilitation', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&fit=crop&auto=format&q=80', FALSE, 10, TRUE),
  ('Bulk Printing', 'Printing', 'High-volume printing services at competitive rates for businesses.', 'bulk-printing', 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=800&fit=crop&auto=format&q=80', FALSE, 11, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- SEO settings (matching current seo/config.ts)
INSERT INTO public.seo_settings (page_slug, title, description, robots) VALUES
  ('/', 'Printing & Documentation Karachi | Mateen Documentation', 'Printing, photocopying, documentation, biometric facilitation and customized printing services in North Nazimabad, Karachi.', 'index,follow'),
  ('/about', 'About Mateen Documentation | North Nazimabad Karachi', 'Learn about Mateen Documentation, a printing, documentation, biometric and public facilitation centre in North Nazimabad, Karachi.', 'index,follow'),
  ('/services', 'Printing & Documentation Services | Mateen Documentation', 'Explore printing, photocopying, customized products, legal documentation, biometric facilitation and business services in Karachi.', 'index,follow'),
  ('/order-online', 'Order Online | Mateen Documentation', 'Send your files online and get your printing and documentation orders processed quickly.', 'index,follow'),
  ('/contact', 'Contact Mateen Documentation | North Nazimabad Karachi', 'Get in touch with Mateen Documentation for printing, documentation, and biometric services.', 'index,follow'),
  ('/privacy-policy', 'Privacy Policy | Mateen Documentation', 'Privacy policy for Mateen Documentation website and services.', 'index,follow'),
  ('/terms-and-conditions', 'Terms & Conditions | Mateen Documentation', 'Terms and conditions for using Mateen Documentation services.', 'index,follow'),
  ('/admin', 'CMS Admin | Mateen Documentation', 'Content management system for Mateen Documentation.', 'noindex,nofollow')
ON CONFLICT (page_slug) DO NOTHING;

-- ============================================================
-- IMPORTANT: After running this migration:
-- 1. Go to Supabase → Authentication → Settings
--    Set Site URL to: https://mateendocumentation.com
--    Add redirect: http://localhost:8443/admin/reset-password
-- 2. Go to Authentication → Users → Add user → Invite a user
--    Enter your admin email and invite
-- 3. After you accept the invite and set password, run:
--    UPDATE public.profiles SET role = 'SUPER_ADMIN', full_name = 'Your Name'
--    WHERE email = 'your-admin-email@example.com';
-- 4. Set environment variables in Vercel:
--    VITE_SUPABASE_URL = your-project-url
--    VITE_SUPABASE_ANON_KEY = your-anon-key
-- ============================================================
