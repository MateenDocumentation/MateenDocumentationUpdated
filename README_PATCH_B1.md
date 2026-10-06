# Mateen CMS Patch B.1 — Shared Labels UI Wiring

Purpose:
- Expose already-seeded shared/public labels in the CMS UI.
- No frontend design/content change.
- No SQL migration required if Patch A (008a_main_public_pages.sql) was already run successfully.

Adds:
- Header Manager: View All Services, desktop/mobile Call/WhatsApp, Send File labels.
- Footer Manager: Trusted since, Services/Quick Links/Contact headings, Privacy/Terms labels, developer prefix, summary line.
- Services Manager: shared labels/CTAs used across all individual service detail pages.

Apply:
1. Copy this patch root-to-root into MateenDocumentationUpdated.
2. Run:
   pnpm exec tsc --noEmit
   pnpm run build
3. Commit/push to cms-integration and verify Preview.

Important:
- Save Header labels with Header Manager > Save Settings.
- Save Footer labels with Footer Manager > Save All.
- Save service shared labels with Services > Save Shared Labels.
