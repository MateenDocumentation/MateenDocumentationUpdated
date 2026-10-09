# Mateen CMS Patch D — SEO + FAQ Upgrade

Target branch: `seo-faq-upgrade` only. Do not apply directly to live `main`.

## Included
- Homepage FAQ section, fully editable in CMS.
- FAQ section on all 12 main service detail pages.
- Client-friendly FAQ editor (add/remove/reorder question + answer; no raw JSON required).
- FAQPage structured data generated at build time from visible CMS FAQ content.
- SEO Settings > Basic SEO adds:
  - Focus Keyword (internal SEO planning field; deliberately NOT emitted as deprecated meta-keywords)
  - Image Alt Text (used for OG/Twitter image alt)
  - Breadcrumb Label (used in BreadcrumbList JSON-LD)
- Student service URL changes from:
  `/services/student-assignment-services`
  to:
  `/services/assignment-printing-binding`
- Internal links/CMS records updated to the new URL.
- 301 redirect is added both to CMS redirects data and `vercel.json` so the old live URL remains SEO-safe.
- Static SEO fallback for the renamed service is updated to `Assignment Printing & Binding`.

## Apply
1. Make sure GitHub Desktop is on `MateenDocumentationUpdated` → `seo-faq-upgrade`.
2. Extract this ZIP root-to-root into the repo and replace files when asked.
3. Supabase SQL Editor: run `migrations/009_seo_faq_upgrade.sql` once.
4. Local terminal in `MateenDocumentationUpdated`:
   `pnpm exec tsc --noEmit`
   `pnpm run build`
5. Review `git status`, then commit/push only to `seo-faq-upgrade`.
6. Set up a Vercel Preview for this branch (same Preview env variables as the existing CMS integration Preview if required).
7. Test before any merge to main:
   - Home FAQ visible/editable
   - Printing & Photocopy FAQ
   - Assignment Printing & Binding new URL
   - old student URL returns permanent redirect to new URL
   - another service FAQ
   - SEO fields save correctly
   - View Source shows FAQPage JSON-LD, breadcrumb label, OG/Twitter alt
   - sitemap contains new URL and not old URL

## Notes
- Existing visible service-page title is not forcibly renamed by this patch; the URL/SEO fallback is changed safely.
- Focus Keyword is an editorial CMS field, not a Google meta tag.
- Existing live `main` remains untouched until Preview QA passes.
