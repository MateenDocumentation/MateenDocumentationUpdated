-- ============================================================
-- 009 SEO + FAQ upgrade
-- Adds page-level SEO planning fields, homepage/service FAQs,
-- and moves Student & Assignment Services to the new SEO-safe URL.
-- Safe to run once; uses IF NOT EXISTS / ON CONFLICT guards.
-- ============================================================

BEGIN;

ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
  ADD COLUMN IF NOT EXISTS image_alt_text TEXT,
  ADD COLUMN IF NOT EXISTS breadcrumb_label TEXT;

-- Rename the student service URL everywhere in primary CMS records.
UPDATE public.pages
SET slug = '/services/assignment-printing-binding', updated_at = NOW()
WHERE slug = '/services/student-assignment-services';

UPDATE public.services
SET slug = 'assignment-printing-binding', updated_at = NOW()
WHERE slug = 'student-assignment-services';

UPDATE public.seo_settings
SET page_slug = '/services/assignment-printing-binding',
    title = 'Assignment Printing & Binding Karachi | Mateen Documentation',
    description = 'Assignment printing, binding, formatting and academic document printing support for school, college and university students in Karachi.',
    canonical_url = 'https://mateendocumentation.com/services/assignment-printing-binding',
    breadcrumb_label = COALESCE(NULLIF(breadcrumb_label, ''), 'Assignment Printing & Binding'),
    updated_at = NOW()
WHERE page_slug = '/services/student-assignment-services';

UPDATE public.navigation_items
SET url = '/services/assignment-printing-binding', updated_at = NOW()
WHERE url = '/services/student-assignment-services';

-- Replace the old internal URL inside editable JSON content and footer links.
UPDATE public.page_sections
SET content = replace(content::text, '/services/student-assignment-services', '/services/assignment-printing-binding')::jsonb,
    updated_at = NOW()
WHERE content::text LIKE '%/services/student-assignment-services%';

UPDATE public.footer_settings
SET service_links = replace(service_links::text, '/services/student-assignment-services', '/services/assignment-printing-binding')::jsonb,
    quick_links = replace(quick_links::text, '/services/student-assignment-services', '/services/assignment-printing-binding')::jsonb,
    updated_at = NOW()
WHERE service_links::text LIKE '%/services/student-assignment-services%'
   OR quick_links::text LIKE '%/services/student-assignment-services%';

INSERT INTO public.redirects (from_path, to_path, status_code, is_active, description, updated_at)
VALUES ('/services/student-assignment-services', '/services/assignment-printing-binding', 301, TRUE, 'SEO-safe redirect after student service URL update', NOW())
ON CONFLICT (from_path) DO UPDATE SET
  to_path = EXCLUDED.to_path,
  status_code = 301,
  is_active = TRUE,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Helpful initial SEO values. Client can edit these later in SEO Settings.
UPDATE public.seo_settings SET
  focus_keyword = COALESCE(NULLIF(focus_keyword, ''), CASE page_slug
    WHEN '/' THEN 'printing and documentation services karachi'
    WHEN '/services/assignment-printing-binding' THEN 'assignment printing and binding karachi'
    ELSE focus_keyword END),
  image_alt_text = COALESCE(NULLIF(image_alt_text, ''), title),
  breadcrumb_label = COALESCE(NULLIF(breadcrumb_label, ''), CASE WHEN page_slug = '/' THEN 'Home' ELSE initcap(replace(split_part(page_slug, '/', 3), '-', ' ')) END),
  updated_at = NOW()
WHERE page_slug = '/' OR page_slug LIKE '/services/%';

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'Homepage FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers about Mateen Documentation, online file submission and our services.", "items": [{"question": "What services does Mateen Documentation provide?", "answer": "We provide printing, photocopying, customized printing, student printing, documentation assistance, biometric and public facilitation, stationery, design and related services from our North Nazimabad location."}, {"question": "Can I send my files online before visiting?", "answer": "Yes. You can send your files through the Order Online form or WhatsApp. Our team can review the requirement before you visit or arrange the next step."}, {"question": "Do you handle both small and bulk printing orders?", "answer": "Yes. We handle single-document jobs as well as larger printing requirements for students, individuals, offices, businesses and organizations."}, {"question": "Where is Mateen Documentation located?", "answer": "We are located in H Block, North Nazimabad, Karachi, near Saifee College. You can also use the map link on our Contact page for directions."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "Do you offer both color and black-and-white printing?", "answer": "Yes. We provide color and black-and-white printing and photocopying in common paper sizes, with custom requirements available where possible."}, {"question": "Can I send a PDF or document online for printing?", "answer": "Yes. You can upload your file through Order Online or send it by WhatsApp, then specify size, quantity, color and finishing requirements."}, {"question": "Do you provide lamination and scanning as well?", "answer": "Yes. Printing-related services include scanning, lamination, document formatting and several other finishing and file-preparation options."}, {"question": "Can you handle bulk printing?", "answer": "Yes. Bulk quantities can be discussed with our team so we can confirm the most suitable material, finishing, timeline and pricing."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/printing-photocopy'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "Do you print and bind assignments and academic documents?", "answer": "Yes. We provide printing, formatting and binding support for school, college and university assignments, projects and academic documents."}, {"question": "Can students send assignments online?", "answer": "Yes. Students can upload files through the website or send them by WhatsApp and share their printing, binding and formatting requirements."}, {"question": "Do you support thesis and project printing?", "answer": "Yes. Thesis, project and other academic printing requirements can be handled based on file size, format, quantity and finishing needs."}, {"question": "Can you help with document formatting before printing?", "answer": "Yes. Basic typing, formatting and file preparation support is available for suitable academic documents before printing."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/assignment-printing-binding'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What customized products can you print?", "answer": "We handle customized products such as mugs, cards, stickers, labels, photo prints, gifts and other personalized print requirements."}, {"question": "Can I provide my own design?", "answer": "Yes. You can send your design file online or by WhatsApp. If needed, discuss the format and print specifications with our team first."}, {"question": "Do you accept small personalized orders?", "answer": "Yes. Both individual personalized items and larger customized orders can be discussed depending on the product and material."}, {"question": "Can customized items be ordered for events or businesses?", "answer": "Yes. Customized printing can be prepared for personal occasions, events, promotions and business use."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/customized-printing'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What kind of NADRA and biometric assistance do you provide?", "answer": "We provide facilitation and documentation assistance for supported NADRA e-Sahulat, biometric and public-service processes. Availability depends on the specific requirement."}, {"question": "Are you a government department?", "answer": "No. Mateen Documentation is an independent facilitation and documentation service provider and is not a government authority unless specifically stated."}, {"question": "Can you guarantee approval of a government application?", "answer": "No. Approval decisions are made by the relevant government or issuing authority. We can assist with documentation and the application process but cannot guarantee outcomes."}, {"question": "What should I bring for a facilitation service?", "answer": "Required documents vary by service. Contact us before visiting so we can tell you what documents or information may be needed for your specific request."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/nadra-biometric-public-facilitation'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "Do you provide legal advice?", "answer": "No. We provide documentation preparation, drafting and facilitation assistance. We are not a law firm and do not provide legal advice."}, {"question": "What documents can you help prepare?", "answer": "We can assist with suitable affidavits, agreements, undertakings, applications, official letters and other documentation requirements."}, {"question": "Can I send document details online first?", "answer": "Yes. You can contact us or send your requirement online so the team can review what documentation assistance may be appropriate."}, {"question": "Do official documents require additional verification or attestation?", "answer": "Some documents may require verification, attestation or approval by the relevant authority. Requirements depend on the document and intended use."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/legal-documentation'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What business documents can you prepare or print?", "answer": "We can assist with business letters, letterheads, certificates, forms, office documentation and related printing requirements."}, {"question": "Do you support bulk office printing?", "answer": "Yes. Bulk printing for offices and businesses can be arranged based on quantity, paper, finishing and turnaround requirements."}, {"question": "Can you design business stationery as well?", "answer": "Yes. Design and printing support is available for selected business stationery and branded materials."}, {"question": "Can a business send files online?", "answer": "Yes. Files and requirements can be submitted through the website or WhatsApp for review before production."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/business-documentation'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What types of cards do you print?", "answer": "We offer PVC cards, ID cards, photo cards, personalized cards and other suitable card-printing requirements."}, {"question": "Can photo frames be customized?", "answer": "Yes. Photo frames can be personalized for family photos, birthdays, weddings, anniversaries, events and other occasions."}, {"question": "Can I send the photo or design online?", "answer": "Yes. You can send your image or design file online or through WhatsApp for review."}, {"question": "Do you accept bulk card or frame orders?", "answer": "Yes. Bulk quantities can be discussed with our team based on the product, design and required quantity."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What insurance-related assistance do you provide?", "answer": "We provide documentation and facilitation assistance for supported insurance-related paperwork and requirements."}, {"question": "Are you an insurance company?", "answer": "No. Mateen Documentation is not an insurer. We provide facilitation and documentation support only."}, {"question": "Can you guarantee an insurance approval or claim outcome?", "answer": "No. Decisions are made by the relevant insurance provider. We can assist with documentation but cannot guarantee approval or claim outcomes."}, {"question": "Can I ask about my requirement before visiting?", "answer": "Yes. Contact us by phone, WhatsApp or the website so we can understand the requirement before you visit."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/insurance-facilitation'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What quantities count as bulk printing?", "answer": "Bulk requirements vary by product. Contact us with the quantity, size, material and finishing details so we can advise on the most suitable option."}, {"question": "Do you provide bulk printing for businesses and institutions?", "answer": "Yes. We serve businesses, offices, schools, colleges, organizations and other customers with larger printing requirements."}, {"question": "Can I request a quote before placing a bulk order?", "answer": "Yes. Send the specifications and quantity so the team can review the job and discuss pricing and turnaround."}, {"question": "Can I upload the print-ready file online?", "answer": "Yes. Files can be submitted online or sent by WhatsApp for review before production."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "Do you supply both office and school stationery?", "answer": "Yes. We provide selected office, school and business stationery items, subject to current availability."}, {"question": "Can businesses order stationery in quantity?", "answer": "Yes. Business and office stationery requirements can be discussed for larger quantities."}, {"question": "Do you offer customized stationery?", "answer": "Selected stationery items can be customized depending on the product and requirement."}, {"question": "Can I check availability before visiting?", "answer": "Yes. Contact us by WhatsApp or phone to confirm the item and quantity you need."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/stationery'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What vehicle documentation can you assist with?", "answer": "We provide documentation and facilitation assistance for supported vehicle-related paperwork, agreements and transfer-related requirements."}, {"question": "Do you handle official vehicle approvals?", "answer": "We can assist with documentation and facilitation, but approvals and official processing remain subject to the relevant authority."}, {"question": "Can I send my requirement before visiting?", "answer": "Yes. You can contact us online or through WhatsApp so the team can understand the documents involved."}, {"question": "What documents will I need?", "answer": "Requirements depend on the vehicle transaction or service. Contact us first so we can advise what information or documents may be needed."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/vehicle-documentation'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'faq', 'FAQ', COALESCE((SELECT MAX(ps.order_index) + 1 FROM public.page_sections ps WHERE ps.page_id = p.id), 0), TRUE, '{"eyebrow": "FAQ", "heading": "Frequently Asked Questions", "description": "Quick answers to common questions about this service.", "items": [{"question": "What design services do you offer?", "answer": "We provide design support for selected business and print materials such as visiting cards, letterheads, flyers, brochures, posters, certificates and related items."}, {"question": "Can you design and print the same item?", "answer": "Yes. For supported products, we can prepare the design and arrange printing as part of the same requirement."}, {"question": "Can I provide an existing logo or brand file?", "answer": "Yes. Send your existing logo, artwork or reference files and explain how they should be used."}, {"question": "Do you support business and promotional materials?", "answer": "Yes. We can assist with suitable business identity and promotional print requirements."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/design-branding'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections existing WHERE existing.page_id = p.id AND existing.type = 'faq');

COMMIT;
