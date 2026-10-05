# Mateen CMS — Patch B: Order Online + Shared/Global Copy

Apply **after Patch A**.

## Scope
- Order Online: helper panels, file-type chips, form labels/options/placeholders, upload copy, success/error copy and final CTA are CMS-driven.
- Header: remaining public labels (View All Services, Call, WhatsApp, mobile action labels, Send File) read from `/shared` → `Shared Website Labels`.
- Footer: remaining public headings/legal/developer/summary labels read from `/shared`.
- Generic service page: common labels/CTAs read from `/shared` (page-specific service content remains Patch C).
- Navigation remains driven by the existing Navigation CMS.

Patch A already seeded the `/shared` `shared_labels` section and its editor, so this patch does not duplicate those records.

## Apply
1. Copy this patch root-to-root into `MateenDocumentationUpdated` and replace matching files.
2. Supabase SQL Editor: run `migrations/008b_order_global_shared.sql` with **Run without RLS**.
3. Run:
   - `pnpm exec tsc --noEmit`
   - `pnpm run build`
4. Commit/push to `cms-integration`.
5. Preview checks:
   - `/admin/pages` → Order Online should contain **Order Form & Helper Copy** + **Final CTA**.
   - `/shared` → Shared Website Labels controls Header/Footer/common service labels.
   - Save one label, Deploy Changes, verify Preview.

Do not run the old monolithic `008_frontend_cms_completeness.sql`.
