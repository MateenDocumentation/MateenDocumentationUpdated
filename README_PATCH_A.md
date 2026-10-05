# Mateen CMS — Patch A: Main Public Pages

Scope: Home, About, Services listing, Contact, plus the CMS editors required by those pages.

## What this patch does
- Home: moves remaining visible microcopy into shared CMS labels, adds CMS-driven Services Showcase and Why Us blocks, benefit icons, side image and CTAs.
- About: adds the final CTA to CMS and icon keys for audience/approach cards.
- Services listing: adds the “Can’t Find What You Need?” block to CMS and editable CTA labels.
- Contact: makes hero/contact/map labels, form labels/options/messages and final CTA editable in CMS.
- Page Editor: provides structured editors for these new section types (no raw JSON required for normal editing).

## Apply
1. Copy this patch root-to-root into `MateenDocumentationUpdated`.
2. Supabase SQL Editor: run `migrations/008a_main_public_pages.sql` once.
3. Run `pnpm exec tsc --noEmit`.
4. Run `pnpm run build`.
5. Commit/push to `cms-integration`, wait for Vercel Preview, then test CMS edits + Deploy Changes.

Do not overwrite protected API/deployment files; this patch does not include them.
