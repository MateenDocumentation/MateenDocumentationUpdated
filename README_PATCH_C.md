# Mateen CMS Patch C — Individual Service Detail Completeness

This is the final service-detail CMS completeness patch.

## Covers all 12 individual service pages
- Printing & Photocopy
- Student & Assignment Services
- Customized Printing
- NADRA / Biometric / Public Facilitation
- Legal Documentation
- Business Documentation
- PVC Cards & Photo Frames
- Insurance Facilitation
- Bulk Printing
- Office & School Stationery
- Vehicle Documentation
- Design & Branding

## What becomes editable
Every individual service page now exposes/uses CMS content for:
- Page/service title
- Breadcrumb
- Hero subtitle
- Hero image
- Intro / About This Service copy
- Important note/disclaimer
- Service-specific final CTA label
- WhatsApp pre-filled message
- Available Services repeater
- How We Help repeater
- How We Help icons (dropdown)
- Related Services repeater
- Shared service labels/CTAs from Patch B/B.1

## Unique page blocks
- Bulk Printing: `We Serve` becomes a CMS Grouped List.
- PVC Cards & Photo Frames:
  - `Photo Frames` becomes a CMS Grouped List.
  - `Card Printing` becomes a CMS Grouped List.
- Group icons use a client-friendly dropdown rather than raw SVG/code.

Hardcoded service-page values remain only as emergency fallback if CMS data is unavailable.

## Apply
1. Extract this ZIP root-to-root into:
   `C:\Users\Sohaib\OneDrive\Documents\GitHub\MateenDocumentationUpdated`

2. Run this migration in Supabase SQL Editor:
   `migrations\008c_service_detail_completeness.sql`

3. Then locally run:
   `pnpm exec tsc --noEmit`
   `pnpm run build`

4. Commit/push to `cms-integration`, wait for Vercel Preview, then verify:
   - Printing & Photocopy
   - PVC Cards & Photo Frames
   - Bulk Printing
   - one documentation/facilitation service

## Important
This patch does not merge to production. Production comes only after Preview QA + forms/SEO/analytics checks.
