# Mateen CMS Remaining Sections Patch

This patch completes the missing CMS page-section setup for the remaining public pages.

## What it adds
- About: Hero, Who We Are, Services Grid, Audiences, Principles, Location
- Services: Hero + Final CTA (service cards remain managed from CMS > Services)
- Contact: Hero + Contact Information
- Order Online: Hero + How It Works
- Privacy Policy: editable legal content
- Terms & Conditions: editable legal content (also fixes the `/terms-and-conditions` CMS slug)
- All 12 Service Detail pages: Hero settings, Available Services, How We Help, Related Services
- Friendly PageEditor fields for the new section types
- About/Contact hero images can be selected from Media Library

## Install order
1. Copy/replace the included source files into the project using the same paths.
2. Run `pnpm exec tsc --noEmit`
3. Run `pnpm run build`
4. In Supabase SQL Editor run `migrations/006_seed_remaining_page_sections.sql`
5. Commit/push to `cms-integration`
6. Wait for Vercel Preview to be Ready
7. Open CMS > Pages and verify sections on About, Services, Contact, Order Online, Privacy, Terms and service detail pages.
8. Click Deploy Changes after editing content.

The SQL migration is idempotent for each page+section type: it only inserts a section when that type does not already exist for that page.
