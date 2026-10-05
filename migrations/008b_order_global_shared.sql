-- 008b_order_global_shared.sql
-- Patch B: Order Online + shared/global frontend copy.
-- Patch A already creates /shared + shared_labels, so this migration focuses on Order Online.
-- Safe/idempotent: inserts only missing sections.
BEGIN;

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'form_config', 'Order Form & Helper Copy', 2, TRUE,
$json${
  "hero_file_types":["PDF","DOC / DOCX","JPG / PNG","PPT / PPTX"],
  "accepted_files_heading":"Accepted Files",
  "accepted_file_types":["PDF","DOC","JPG","PNG","PPT"],
  "accepted_files_note":"Other formats accepted — describe in message.",
  "whatsapp_panel_heading":"Prefer WhatsApp?",
  "whatsapp_panel_text":"Send your file directly on WhatsApp for the fastest response.",
  "whatsapp_button_label":"Send on WhatsApp",
  "send_items_heading":"You Can Send:",
  "send_items":["Assignment","PDF Document","Photograph","Design File","Printing File","Customized Requirement","Bulk Order Requirement"],
  "privacy_text":"Your files are used only to prepare your order and are not shared with third parties.",
  "form_heading":"Your Order Requirement",
  "success_heading":"Requirement Submitted!",
  "success_text":"We'll contact you to confirm details before processing your order.",
  "success_button_label":"Continue on WhatsApp",
  "name_label":"Full Name *","name_placeholder":"Your full name",
  "phone_label":"Phone *","phone_placeholder":"03xx-xxxxxxx",
  "whatsapp_label":"WhatsApp (if different)","whatsapp_placeholder":"03xx-xxxxxxx",
  "email_label":"Email (optional)","email_placeholder":"your@email.com",
  "category_label":"Service Category *",
  "service_placeholder":"Select a service...",
  "category_options":["Printing & Photocopy","Student Services","Customized Printing","NADRA / Biometric","Legal Documentation","Business Documentation","Other"],
  "upload_label":"Upload File","upload_prompt":"Drop your file here or click to browse","max_file_text":"Max 20MB","file_change_text":"Click to change",
  "quantity_label":"Quantity","quantity_placeholder":"e.g. 50 copies",
  "printing_type_label":"Printing Type","printing_type_options":["Color","Black & White","Not Applicable"],
  "paper_label":"Paper / Material","paper_placeholder":"e.g. Plain, Glossy, Card Stock",
  "size_label":"Size","size_placeholder":"e.g. A4, A3, Custom",
  "special_label":"Special Requirements","special_placeholder":"Binding, lamination, spiral, etc.",
  "message_label":"Additional Message","message_placeholder":"Any other details or instructions...",
  "submit_label":"Submit Requirement →","sending_label":"Submitting…","error_text":"Submission failed. Please try again."
}$json$::jsonb
FROM public.pages p
WHERE p.slug='/order-online'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id=p.id AND s.type='form_config'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'final_cta', 'Final CTA', 3, TRUE,
$json${"heading_line1":"Ready to Get","heading_line2":"Started?","wa_label":"WhatsApp Us","primary_label":"Contact Us","primary_url":"/contact","phone_label":"Call Us"}$json$::jsonb
FROM public.pages p
WHERE p.slug='/order-online'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id=p.id AND s.type='final_cta'
  );

COMMIT;
