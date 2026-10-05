-- 008a_main_public_pages.sql
-- Patch A: Home, About, Services listing and Contact frontend-to-CMS completeness.
-- Idempotent: adds only missing sections and augments existing editable content.
BEGIN;

-- ---------------------------------------------------------------------------
-- Shared/global editable labels used by Header, Footer, breadcrumbs and all
-- generic service-detail pages.
-- ---------------------------------------------------------------------------
INSERT INTO public.pages (name, slug, status, is_protected)
SELECT 'Shared Website Labels', '/shared', 'published', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = '/shared');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'shared_labels', 'Shared Website Labels', 0, TRUE,
$json${
  "items": [
    {"key":"breadcrumb_home","value":"Home"},
    {"key":"breadcrumb_about","value":"About"},
    {"key":"breadcrumb_services","value":"Services"},
    {"key":"breadcrumb_contact","value":"Contact"},
    {"key":"breadcrumb_order_online","value":"Order Online"},
    {"key":"services_categories_accessible","value":"Service categories"},

    {"key":"header_view_all_services","value":"View All Services"},
    {"key":"header_call","value":"Call"},
    {"key":"header_whatsapp","value":"WhatsApp"},
    {"key":"header_call_mobile","value":"CALL"},
    {"key":"header_whatsapp_mobile","value":"WHATSAPP"},
    {"key":"header_send_file","value":"SEND FILE"},

    {"key":"footer_trusted_since","value":"Trusted since"},
    {"key":"footer_services_heading","value":"Services"},
    {"key":"footer_all_services","value":"All 12 Services →"},
    {"key":"footer_quick_links_heading","value":"Quick Links"},
    {"key":"footer_contact_heading","value":"Contact"},
    {"key":"footer_privacy","value":"Privacy Policy"},
    {"key":"footer_terms","value":"Terms & Conditions"},
    {"key":"footer_developed_by","value":"Designed and Developed by"},
    {"key":"footer_summary","value":"Printing · Documentation · Biometric · Public Facilitation · Customized Printing · Cards · Stationery · Business Services"},

    {"key":"available_services","value":"Available Services"},
    {"key":"what_we_offer","value":"What We Offer"},
    {"key":"simple_process","value":"Simple Process"},
    {"key":"how_we_help","value":"How We Help You"},
    {"key":"explore_more","value":"Explore More"},
    {"key":"you_might_need","value":"You Might Also Need"},
    {"key":"service","value":"Service"},
    {"key":"whatsapp_us","value":"WhatsApp Us"},
    {"key":"send_requirement","value":"Send Requirement Online"},
    {"key":"call_now","value":"Call Now"},
    {"key":"about_service","value":"About This Service"},
    {"key":"explore","value":"Explore"},
    {"key":"get_started_eyebrow","value":"Get Started Today"},
    {"key":"ready_heading","value":"Ready to Get Started?"},
    {"key":"ready_description","value":"Visit us in H Block North Nazimabad, send your file online, or WhatsApp us now."},
    {"key":"whatsapp_now","value":"WhatsApp Us Now"},
    {"key":"order_online","value":"Order Online"},
    {"key":"phone_cta","value":"Call Now"},

    {"key":"home_printing_progress","value":"PRINTING IN PROGRESS"},
    {"key":"home_scan_copy","value":"Scan & Copy"},
    {"key":"home_photo_gloss","value":"Photo & Gloss Prints"},
    {"key":"home_print_formats","value":"A4 • A3 • Color • B&W"},
    {"key":"home_finishing","value":"Lamination · Binding · Gloss"},
    {"key":"home_same_day","value":"Same-Day Ready"},
    {"key":"home_core_service","value":"Core Service"},
    {"key":"home_for_students","value":"For Students"},
    {"key":"home_project_folders","value":"Project Folders & Reports"},
    {"key":"home_thesis_reports","value":"Thesis & Reports"},
    {"key":"home_assignments_reports","value":"Assignments & Reports"},
    {"key":"home_assignment_label","value":"Assignment"},
    {"key":"home_editing_formatting","value":"Editing & Formatting"},
    {"key":"home_typing_label","value":"Typing"},
    {"key":"home_spiral_binding","value":"Spiral & Ring Binding"},
    {"key":"home_binding_label","value":"Binding"},
    {"key":"home_print_bind_submit","value":"Print • Bind • Submit"},
    {"key":"home_ready_submission","value":"Ready for Submission"},
    {"key":"home_process_label","value":"Process"},
    {"key":"home_customized_label","value":"Customized Printing"},
    {"key":"home_photo_mugs","value":"Photo Mugs & Gifts"},
    {"key":"home_business_cards","value":"Business Cards & Letterheads"},
    {"key":"home_photo_frames","value":"Photo Frames & Prints"},
    {"key":"home_custom_stickers","value":"Custom Stickers & Labels"},
    {"key":"home_branded_merch","value":"Branded Merchandise"},
    {"key":"home_your_idea_printed","value":"Your Idea, Printed."},
    {"key":"home_services_watermark","value":"SERVICES"},
    {"key":"home_community_watermark","value":"COMMUNITY"},
    {"key":"home_final_cta_eyebrow","value":"Visit Us · WhatsApp · Order Online"}
  ]
}$json$::jsonb
FROM public.pages p
WHERE p.slug = '/shared'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s WHERE s.page_id = p.id AND s.type = 'shared_labels'
  );

-- ---------------------------------------------------------------------------
-- Home: Why Us and Services Showcase were visible but previously hardcoded.
-- ---------------------------------------------------------------------------
INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'why_us', 'Why Us', 8, TRUE,
jsonb_build_object(
  'eyebrow','Why Us',
  'heading_line1','Why Choose',
  'heading_line2','Mateen Documentation?',
  'description','One centre for everything — printing, documentation, facilitation, student services and customized products.',
  'items',$json$[
    {"n":"01","title":"All Under One Roof","body":"Printing, documentation, NADRA facilitation, customized products — one visit, zero running around.","icon_key":"home"},
    {"n":"02","title":"Online File Submission","body":"Send your file via WhatsApp or the order form — no need to come in person for standard jobs.","icon_key":"upload"},
    {"n":"03","title":"Student Friendly","body":"Dedicated support for assignments, thesis, projects and last-minute submission requirements.","icon_key":"student"},
    {"n":"04","title":"Business Friendly","body":"Bulk printing, business documentation, letterheads, stamps and branding — handled professionally.","icon_key":"business"},
    {"n":"05","title":"Customized Solutions","body":"Mugs, frames, PVC cards, stickers, banners — personalized items for gifts, events and brands.","icon_key":"custom"},
    {"n":"06","title":"Central Location","body":"H Block, North Nazimabad, near Saifee College — accessible, known, and community-embedded.","icon_key":"location"}
  ]$json$::jsonb,
  'image_url',COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1685609241440-f14d86cea774?w=500&h=800&fit=crop&auto=format' LIMIT 1),'https://images.unsplash.com/photo-1685609241440-f14d86cea774?w=500&h=800&fit=crop&auto=format'),
  'image_alt','Staff assisting customer with documents',
  'image_heading','Trusted by the community',
  'image_subtext','North Nazimabad''s multi-service print centre',
  'cta_heading','Ready to get started?',
  'wa_label','WhatsApp Us',
  'wa_message','Hi, I would like to ask about Mateen Documentation services.',
  'order_label','Order Online',
  'order_url','/order-online'
)
FROM public.pages p
WHERE p.slug='/'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='why_us');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_showcase', 'Services Showcase', 7, TRUE,
$json${
  "eyebrow":"All Services",
  "heading":"Everything In One Place",
  "popular_badge":"Most Popular",
  "featured_link_label":"Explore Service",
  "medium_link_label":"Learn more",
  "small_link_label":"Details",
  "view_all_label":"View All 12 Services",
  "view_all_url":"/services",
  "service_slugs":["printing-photocopy","student-assignment-services","customized-printing","nadra-biometric-public-facilitation","legal-documentation","business-documentation"]
}$json$::jsonb
FROM public.pages p
WHERE p.slug='/'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='services_showcase');

-- ---------------------------------------------------------------------------
-- About: final CTA + icon keys for audience and approach cards.
-- ---------------------------------------------------------------------------
INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'final_cta', 'Final CTA', 6, TRUE,
$json${"eyebrow":"READY WHEN YOU ARE","heading_line1":"Come Visit Us","heading_line2":"Today.","wa_label":"WhatsApp Us","wa_message":"Hi, I would like to ask about Mateen Documentation services.","primary_label":"Order Online","primary_url":"/order-online","phone_label":"Call Now"}$json$::jsonb
FROM public.pages p
WHERE p.slug='/about'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='final_cta');

WITH target AS (
  SELECT ps.id,
    (SELECT jsonb_agg(item || jsonb_build_object('icon_key', icons.key) ORDER BY ord)
     FROM jsonb_array_elements(ps.content->'items') WITH ORDINALITY x(item, ord)
     JOIN (VALUES (1,'book'),(2,'people'),(3,'building'),(4,'briefcase'),(5,'globe'),(6,'organization')) icons(ord,key) USING (ord)) AS items
  FROM public.page_sections ps JOIN public.pages p ON p.id=ps.page_id
  WHERE p.slug='/about' AND ps.type='audiences'
)
UPDATE public.page_sections ps SET content=jsonb_set(ps.content,'{items}',target.items,true)
FROM target WHERE ps.id=target.id AND target.items IS NOT NULL;

WITH target AS (
  SELECT ps.id,
    (SELECT jsonb_agg(item || jsonb_build_object('icon_key', icons.key) ORDER BY ord)
     FROM jsonb_array_elements(ps.content->'items') WITH ORDINALITY x(item, ord)
     JOIN (VALUES (1,'target'),(2,'globe'),(3,'sliders')) icons(ord,key) USING (ord)) AS items
  FROM public.page_sections ps JOIN public.pages p ON p.id=ps.page_id
  WHERE p.slug='/about' AND ps.type='principles'
)
UPDATE public.page_sections ps SET content=jsonb_set(ps.content,'{items}',target.items,true)
FROM target WHERE ps.id=target.id AND target.items IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Services listing: help CTA.
-- ---------------------------------------------------------------------------
INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'help_cta', 'Can’t Find What You Need?', 2, TRUE,
$json${"heading":"Can't Find What You Need?","description":"Send us your specific requirement — we'll let you know if we can help.","primary_label":"Send Your Requirement","primary_url":"/order-online","secondary_label":"WhatsApp Us","wa_message":"Hi, I have a specific service requirement and would like to ask if you can help."}$json$::jsonb
FROM public.pages p
WHERE p.slug='/services'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='help_cta');

-- ---------------------------------------------------------------------------
-- Contact: labels/map copy, form configuration and final CTA.
-- ---------------------------------------------------------------------------
UPDATE public.page_sections ps
SET content = ps.content || $json${
  "hero_call_label":"Call",
  "hero_whatsapp_label":"WhatsApp",
  "address_label":"Address",
  "phone_label":"Phone",
  "whatsapp_label":"WhatsApp",
  "email_label":"Email",
  "directions_label":"Get Directions",
  "direct_whatsapp_label":"WhatsApp Us",
  "location_eyebrow":"FIND US",
  "location_heading":"Visit Our Centre",
  "map_title":"H Block, North Nazimabad",
  "map_helper":"Tap to open in Google Maps",
  "map_button_label":"Open Maps"
}$json$::jsonb
FROM public.pages p
WHERE ps.page_id=p.id AND p.slug='/contact' AND ps.type='contact_info';

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'form_config', 'Contact Form', 2, TRUE,
$json${
  "form_heading":"Send Us a Message",
  "success_heading":"Message Sent!",
  "success_text":"Thank you! Your message has been submitted successfully. We’ll contact you shortly.",
  "success_button_label":"Continue on WhatsApp",
  "name_label":"Full Name *","name_placeholder":"Your full name",
  "phone_label":"Phone *","phone_placeholder":"03xx-xxxxxxx",
  "email_label":"Email (optional)","email_placeholder":"your@email.com",
  "service_label":"Service","service_placeholder":"Select a service...",
  "service_options":["Printing & Photocopy","Student Services","Customized Printing","NADRA / Biometric","Legal Documentation","Business Documentation","Other"],
  "message_label":"Message","message_placeholder":"How can we help you?",
  "submit_label":"Send Message →","sending_label":"Sending…",
  "error_text":"Submission failed. Please try again."
}$json$::jsonb
FROM public.pages p
WHERE p.slug='/contact'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='form_config');

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'final_cta', 'Final CTA', 3, TRUE,
$json${"heading_line1":"Get It Done.","heading_line2":"Today.","wa_label":"WhatsApp Us","primary_label":"Order Online","primary_url":"/order-online","phone_label":"Call Now"}$json$::jsonb
FROM public.pages p
WHERE p.slug='/contact'
  AND NOT EXISTS (SELECT 1 FROM public.page_sections s WHERE s.page_id=p.id AND s.type='final_cta');


-- Keep Home section ordering deterministic after adding Services Showcase + Why Us.
UPDATE public.page_sections ps
SET order_index = 9
FROM public.pages p
WHERE ps.page_id = p.id AND p.slug = '/' AND ps.type = 'final_cta' AND ps.order_index < 9;

COMMIT;
