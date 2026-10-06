-- Patch C: Complete CMS controls for all 12 individual service detail pages.
-- Safe/idempotent: existing edited values are preserved; only missing hero keys/icons are seeded.

BEGIN;

-- 1) Add page-level service hero/intro/CTA fields so every individual service page
--    can be fully edited from Pages > [Service] > Hero.
WITH service_seed(slug, title, breadcrumb, intro, cta_label) AS (
  VALUES
    ('/services/bulk-printing',
      'Bulk Printing',
      'Bulk Printing',
      'Mateen Documentation handles bulk printing orders of all kinds — from assignment printing for students to business printing for offices and bulk customized products for organizations. Whether you need 50 copies or 5,000, send your requirement to get a quote. We accommodate custom sizes, quantities and special printing requirements.',
      'Request a Bulk Order Quote'),
    ('/services/business-documentation',
      'Business Documentation',
      'Business Documentation',
      'Mateen Documentation assists offices, businesses and organizations with a wide range of business documents. We prepare company letterheads, experience and salary certificates, salary slips, business letters, employment documents, and customized business forms — professionally drafted and formatted to your requirements.',
      'Get Business Documentation Assistance'),
    ('/services/cards-photo-frames',
      'PVC Cards & Photo Frames',
      'Cards & Photo Frames',
      'Mateen Documentation provides beautiful custom photo frames for birthdays, weddings, anniversaries, family moments, and business use — alongside professional PVC, glossy, luster and ID card printing. All frames and cards can be customized to your specifications.',
      'Order Cards & Frames'),
    ('/services/customized-printing',
      'Customized Printing',
      'Customized Printing',
      'Mateen Documentation offers a wide range of customized printing products. From personalized mugs and love cards to custom stickers, labels and gifts — we bring your ideas to life. Perfect for personal use, special occasions, events and bulk customized orders. Send your design file online or discuss your idea with us.',
      'Request Customized Printing'),
    ('/services/design-branding',
      'Design & Branding',
      'Design & Branding',
      'Mateen Documentation provides design and printing services for business identity and promotional needs. From visiting cards and company letterheads to brochures, flyers, posters and certificates — we design and print professional materials. Discuss your requirements with us and we''ll create designs suited to your business.',
      'Discuss Your Design'),
    ('/services/insurance-facilitation',
      'Insurance Facilitation',
      'Insurance Facilitation',
      'Mateen Documentation provides facilitation and documentation assistance for third-party motor insurance and related requirements. We help with forms, paperwork, and supporting documents. Please note: Mateen Documentation is not an insurance company — we provide facilitation and documentation assistance only.',
      'Ask About Insurance Facilitation'),
    ('/services/legal-documentation',
      'Legal Documentation',
      'Legal Documentation',
      'Mateen Documentation provides documentation preparation, drafting and facilitation assistance for a wide range of legal and official documents. We assist with affidavits, agreements, rent agreements, power of attorney, will deeds, and more. Please note: Mateen Documentation provides documentation assistance and drafting services — we are not a law firm. For legal advice, consult a qualified legal professional.',
      'Discuss Your Documentation Requirement'),
    ('/services/nadra-biometric-public-facilitation',
      'NADRA / Biometric / Public Facilitation',
      'NADRA / Biometric / Public Facilitation',
      'Mateen Documentation provides facilitation and assistance for NADRA e-Sahulat services, biometric processes, CNIC renewal, CRC, birth and death certificates, Nikah Nama, and a wide range of government and private applications. We assist you in completing forms, uploading documents, and navigating the process — saving you time and effort.',
      'Ask About Biometric & NADRA Facilitation'),
    ('/services/printing-photocopy',
      'Printing & Photocopy',
      'Printing & Photocopy',
      'Mateen Documentation provides comprehensive printing and photocopy services for all needs. Whether you need a single page or a bulk print job, B&W documents or vibrant color prints, passport photographs or large-format stickers — we handle it all with quality and speed. You can visit us in person or send your file online.',
      'Send Your Printing Requirement'),
    ('/services/stationery',
      'Office & School Stationery',
      'Stationery',
      'Mateen Documentation provides stationery for offices, schools and businesses. Whether you need regular office supplies, school stationery for students, or customized stationery items for your business — we make it convenient by keeping it all at one location. Contact us to discuss your specific stationery requirements.',
      'Enquire About Stationery'),
    ('/services/student-assignment-services',
      'Student & Assignment Services',
      'Student & Assignment Services',
      'Mateen Documentation makes academic work easy for students at every level. We handle school, college and university assignments — from typing and formatting to printing and binding. Submit your files online via WhatsApp or our order form, or visit us directly. We support English and Urdu documents, PDFs, and bulk academic printing.',
      'Send Your Assignment Online'),
    ('/services/vehicle-documentation',
      'Vehicle Documentation',
      'Vehicle Documentation',
      'Mateen Documentation provides facilitation and documentation assistance for vehicle-related requirements. From sale agreements and ownership transfer documents to file loss facilitation and duplicate sale certificates — we help you prepare and manage the required paperwork efficiently.',
      'Ask About Vehicle Documentation')
), target AS (
  SELECT ps.id, ps.content, s.title, s.breadcrumb, s.intro, s.cta_label
  FROM service_seed s
  JOIN public.pages p ON p.slug = s.slug
  JOIN public.page_sections ps ON ps.page_id = p.id AND ps.type = 'hero'
)
UPDATE public.page_sections ps
SET content =
  CASE WHEN ps.content ? 'title' THEN ps.content ELSE jsonb_set(ps.content, '{title}', to_jsonb(t.title), true) END
  || CASE WHEN ps.content ? 'breadcrumb' THEN '{}'::jsonb ELSE jsonb_build_object('breadcrumb', t.breadcrumb) END
  || CASE WHEN ps.content ? 'intro' THEN '{}'::jsonb ELSE jsonb_build_object('intro', t.intro) END
  || CASE WHEN ps.content ? 'cta_label' THEN '{}'::jsonb ELSE jsonb_build_object('cta_label', t.cta_label) END,
    updated_at = NOW()
FROM target t
WHERE ps.id = t.id;

-- 2) Add editable icon keys to existing How We Help steps without changing text.
WITH step_rows AS (
  SELECT
    ps.id,
    jsonb_agg(
      CASE
        WHEN step.value ? 'icon_key' THEN step.value
        ELSE step.value || jsonb_build_object(
          'icon_key',
          CASE ((step.ordinality - 1) % 4)
            WHEN 0 THEN 'upload'
            WHEN 1 THEN 'clipboard'
            WHEN 2 THEN 'wrench'
            ELSE 'truck'
          END
        )
      END
      ORDER BY step.ordinality
    ) AS steps
  FROM public.page_sections ps
  JOIN public.pages p ON p.id = ps.page_id
  CROSS JOIN LATERAL jsonb_array_elements(COALESCE(ps.content->'steps', '[]'::jsonb)) WITH ORDINALITY AS step(value, ordinality)
  WHERE ps.type = 'how_steps'
    AND p.slug LIKE '/services/%'
  GROUP BY ps.id
)
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{steps}', sr.steps, true),
    updated_at = NOW()
FROM step_rows sr
WHERE ps.id = sr.id;

-- 3) Bulk Printing unique frontend block: "We Serve".
INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'group_list', 'We Serve', 4, TRUE,
  '{"heading":"We Serve","icon_key":"users","items":["Students","Schools","Colleges","Offices","Businesses","Organizations"]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections ps
    WHERE ps.page_id = p.id AND ps.type = 'group_list' AND ps.label = 'We Serve'
  );

-- 4) PVC Cards & Photo Frames unique frontend blocks.
INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'group_list', 'Photo Frames', 4, TRUE,
  '{"heading":"Photo Frames","icon_key":"photo","items":["Custom Photo Frames","Personalized Photo Frames","Family Photo Frames","Couple Photo Frames","Birthday Photo Frames","Wedding Photo Frames","Anniversary Photo Frames","Event & Occasion Photo Frames","Photo Collage Frames","Promotional Photo Frames","Business & Office Photo Frames","Photo Frame Advertising","Bulk Photo Frame Orders"]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections ps
    WHERE ps.page_id = p.id AND ps.type = 'group_list' AND ps.label = 'Photo Frames'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'group_list', 'Card Printing', 5, TRUE,
  '{"heading":"Card Printing","icon_key":"card","items":["PVC Cards","Glossy Cards","Luster Cards","ID Cards","Customized Cards","Photo Cards","Personalized Cards","Card Design & Printing"]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections ps
    WHERE ps.page_id = p.id AND ps.type = 'group_list' AND ps.label = 'Card Printing'
  );

COMMIT;
