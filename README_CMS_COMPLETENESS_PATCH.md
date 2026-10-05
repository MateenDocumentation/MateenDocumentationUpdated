# Mateen CMS completeness patch

This patch closes the main CMS/frontend mismatch found during QA.

## What it fixes
- Every service-detail Hero now always shows a **Hero image** Media Library picker.
- ServicePage uses the page-section Hero image first, then Services image, then code fallback.
- Current 12 service hero images are linked into `page_sections` and `services.image_url`.
- Home Printing, Academic and Customized section image fields are populated with imported Media Library URLs.
- Home Who We Serve panel images, About hero/section/card images and Contact hero are linked to imported Media Library URLs where available.
- Raw JSON editors for About audiences/principles, service lists, related services and About service cards are replaced by normal Add/Edit/Remove/Reorder controls.

## Apply
1. Copy the patch files into the project root.
2. Supabase SQL Editor: run `migrations/007_complete_media_links.sql` using **Run without RLS**.
3. `pnpm exec tsc --noEmit`
4. `pnpm run build`
5. Commit/push `cms-integration`, wait for Preview Ready.
6. CMS -> Deploy Changes.
