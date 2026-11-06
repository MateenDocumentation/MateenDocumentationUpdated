# Mateen CMS Patch E — Heading Level + Visual Size Controls

## Scope
Adds separate heading semantics and presentation controls in the CMS.

For editable sections that contain a primary heading/title, the editor now provides:
- Heading level (HTML tag): H1 / H2 / H3 / H4 / H5 / H6
- Visual size: Use design default / Small / Medium / Large / Extra Large
- Custom font size in pixels (optional)

Custom font size overrides Visual size. Changing the visual size does **not** change the semantic HTML heading tag.

## Website wiring included
- Homepage major CMS-driven section headings
- Individual service page hero + main CMS-driven service section headings
- Generic Heading section editor

Existing pages keep their current design unless a heading presentation option is explicitly changed.

## No database migration
The controls are stored inside the existing `page_sections.content` JSON, so no SQL migration is required.

## Apply
1. Ensure branch is `seo-faq-upgrade`.
2. Extract this ZIP root-to-root into `MateenDocumentationUpdated`.
3. Run:
   - `pnpm exec tsc --noEmit`
   - `pnpm run build`
4. Commit/push to `seo-faq-upgrade` and verify on Vercel Preview.

## Not included
- Blog/News (explicitly out of scope)
- Dynamic page creation / editable page URLs (next/final patch)
