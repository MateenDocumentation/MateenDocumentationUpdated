-- ============================================================
-- Mateen Documentation CMS — Phase 4 Migration
-- Publishing Workflow, Version History, Audit Log, Deploy Tracking
-- Run AFTER 002_cms_phase3.sql
-- Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── 1. Expand pages.status to support 'unpublished' ─────────────────────────
ALTER TABLE public.pages
  DROP CONSTRAINT IF EXISTS pages_status_check;
ALTER TABLE public.pages
  ADD CONSTRAINT pages_status_check
  CHECK (status IN ('draft', 'published', 'unpublished'));

-- Track who published/unpublished and when
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS published_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_edited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_edited_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ─── 2. Enhance content_versions for proper before/after diffing ─────────────
--     Existing: id, table_name, record_id, snapshot, changed_by, created_at
--     Add: new_snapshot (the state AFTER the change), action label
ALTER TABLE public.content_versions
  ADD COLUMN IF NOT EXISTS new_snapshot  JSONB,
  ADD COLUMN IF NOT EXISTS action        TEXT NOT NULL DEFAULT 'edit',
  ADD COLUMN IF NOT EXISTS rollback_of   UUID REFERENCES public.content_versions(id) ON DELETE SET NULL;

-- Index for fast per-record version lookups
CREATE INDEX IF NOT EXISTS idx_content_versions_record ON public.content_versions (table_name, record_id, created_at DESC);

-- ─── 3. Deployment logs ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deployment_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  triggered_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  triggered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'triggered', 'failed')),
  page_id        UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  page_slug      TEXT,
  action         TEXT NOT NULL DEFAULT 'publish',  -- publish | unpublish | manual
  error_message  TEXT,
  deploy_id      TEXT  -- Vercel deployment ID returned by hook (if available)
);

-- RLS: CMS users can read; super_admin can write via service role (server-side)
ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CMS users read deploy logs" ON public.deployment_logs;
CREATE POLICY "CMS users read deploy logs" ON public.deployment_logs
  FOR SELECT USING (public.is_cms_user());

-- Writes happen server-side (api/publish.ts uses service_role key, bypasses RLS)

-- ─── 4. Fix audit_logs RLS ────────────────────────────────────────────────────
-- Ensure audit_logs allows insert by CMS users (some inserts from frontend hooks)
DROP POLICY IF EXISTS "CMS users insert audit logs" ON public.audit_logs;
CREATE POLICY "CMS users insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_cms_user());

DROP POLICY IF EXISTS "CMS users read audit logs" ON public.audit_logs;
CREATE POLICY "CMS users read audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_cms_user());

-- ─── 5. Fix content_versions RLS ─────────────────────────────────────────────
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CMS users read versions" ON public.content_versions;
CREATE POLICY "CMS users read versions" ON public.content_versions
  FOR SELECT USING (public.is_cms_user());

DROP POLICY IF EXISTS "CMS users insert versions" ON public.content_versions;
CREATE POLICY "CMS users insert versions" ON public.content_versions
  FOR INSERT WITH CHECK (public.is_cms_user());

-- Rollback = INSERT of a new version (the restore), not UPDATE
-- So SUPER_ADMIN rollback inserts a new version + updates the source record directly

-- ─── 6. Preview: seo_settings for preview routes ─────────────────────────────
-- Preview routes at /admin/preview/* are already excluded because admin/* is noindex.
-- No schema change needed. The admin route RLS already covers this.

-- ─── 7. Seed: ensure deployment_logs table is clean ──────────────────────────
-- No seed data needed — populated at runtime

-- ─── 8. Helper: get latest version for a record ──────────────────────────────
CREATE OR REPLACE FUNCTION public.get_latest_version(p_table TEXT, p_record UUID)
RETURNS SETOF public.content_versions
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT * FROM public.content_versions
  WHERE table_name = p_table AND record_id = p_record::TEXT
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- ============================================================
-- Environment variables required (set in Vercel Dashboard):
--   SUPABASE_URL                 = https://your-project.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY    = eyJ... (server-side ONLY — never in frontend)
--   VERCEL_DEPLOY_HOOK_URL       = https://api.vercel.com/v1/integrations/deploy/...
--
-- After running this migration:
--   1. Set SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables
--   2. Create a Deploy Hook in Vercel → Settings → Git → Deploy Hooks
--      Name: "CMS Publish", Branch: main
--   3. Copy the hook URL → add as VERCEL_DEPLOY_HOOK_URL in Vercel env vars
--   4. Redeploy once manually to pick up the new environment variables
-- ============================================================
