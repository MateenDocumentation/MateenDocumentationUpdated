# Mateen Documentation — CMS Media Library Patch

This patch centralizes the website media around Supabase `cms-media`.

## What it adds
- One-time **Import Website Media** action in Admin > Media Library.
- Imports existing external website images plus the local logo, favicon, Home hero poster and Home hero video into Supabase Storage.
- Adds `source_url` mapping so current hardcoded fallback URLs resolve to CMS-hosted assets after import.
- Updates Services records to use Media Library URLs; service listing + service detail hero then use the same CMS image.
- Adds a reusable **Choose from Media Library** picker to page sections, Services, Settings and SEO image fields.
- Wires Home, About, Services and Contact public media to CMS Media Library mapping.
- Adds CMS-controlled Home media fields for printing, academic, customized printing and Who We Serve sections.
- Adds build-time media snapshot and CMS favicon support.

## Required order
1. Run `migrations/005_media_source_url.sql` in Supabase SQL Editor.
2. Copy this patch over the `MateenDocumentationUpdated` repo, preserving folders.
3. Run `pnpm exec tsc --noEmit` and `pnpm run build`.
4. Commit/push only to `cms-integration`.
5. Wait for Vercel Preview to become Ready.
6. In `/admin/media`, click **Import Website Media** once.
7. When complete, click global **Deploy Changes**.
8. Verify Preview, then test changing one image using **Choose from Media Library**.

## Safety
- This patch does not touch `api/submit.ts`, `api/publish.ts`, `api/deploy.ts`, `index.html`, `.gitattributes`, or the GA4 setup.
- Do not enable Git LFS.
- Existing local assets remain as safe code fallbacks.
- The importer is repeat-safe: already imported `source_url` items are reused rather than duplicated.
- If one remote asset fails to download, the importer skips it and continues; successful imports remain linked.
