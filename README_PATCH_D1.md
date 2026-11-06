# Mateen CMS Patch D.1 — Corrective UI Patch

## Scope
This patch fixes only the two remaining Patch D UI issues.

### 1. FAQ editor
- Detects FAQ sections by type, label, or question/answer content shape.
- Prevents FAQ content from falling back to the raw JSON editor.
- Provides a client-friendly FAQ editor:
  - Question field
  - Answer textarea
  - Add FAQ
  - Remove
  - Move Up / Move Down

### 2. SEO targeting fields
Makes the following fields clearly visible in the Basic SEO edit screen in a dedicated **SEO Targeting** panel:
- Focus Keyword
- Image Alt Text
- Breadcrumb

No database migration is required. Migration `009_seo_faq_upgrade.sql` has already added the required database columns.

## Apply
Copy this ZIP root-to-root into the `MateenDocumentationUpdated` repository while branch `seo-faq-upgrade` is selected.

Then run locally:

```bat
pnpm exec tsc --noEmit
pnpm run build
```

If both pass, commit and push to `seo-faq-upgrade`, then verify on Vercel Preview.

## Not included
- No redirect changes (existing Preview redirect is already working).
- No Blog/News work.
- No production/main changes.
