-- 006_seed_remaining_page_sections.sql
-- Seeds CMS sections for all remaining public pages without overwriting existing sections.
BEGIN;

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"eyebrow": "ABOUT MATEEN DOCUMENTATION", "title_line1": "Multiple Services.", "title_line2": "One Convenient Place.", "subtitle": "A multi-service printing, documentation, biometric and public facilitation centre in H Block, North Nazimabad — all your needs handled under one roof.", "background_image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&auto=format"}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'who_we_are', 'Who We Are', 1, TRUE, '{"eyebrow": "WHO WE ARE", "heading": "Your Neighbourhood Documentation & Print Centre", "body1": "Mateen Documentation is a multi-service centre providing printing, photocopying, scanning, documentation, biometric facilitation, customized printing, student assignment services and business documentation — all in one convenient location in H Block, North Nazimabad.", "body2": "Whether you''re a student needing your assignment printed and bound, a professional requiring legal documents, a family visiting for NADRA facilitation, or a business ordering bulk letterheads — we serve everyone under one roof.", "tags": ["Printing", "Documentation", "Biometric", "Customized", "Student Services", "Business"], "image": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&h=860&fit=crop&auto=format", "image_alt": "Mateen Documentation Centre — H Block, North Nazimabad"}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'who_we_are'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_grid', 'Services Grid', 2, TRUE, '{"eyebrow": "OUR SERVICES", "heading": "What We Do", "items": [{"title": "Printing & Photocopy", "eyebrow": "PRINT & COPY", "desc": "Color & B&W printing, photocopy, scanning, photo printing, lamination, passport photos and more.", "image": "https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=700&h=500&fit=crop&auto=format", "to": "/services/printing-photocopy"}, {"title": "Student Services", "eyebrow": "ACADEMIC", "desc": "Assignment printing, typing, thesis binding, project work and academic document support.", "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&h=500&fit=crop&auto=format", "to": "/services/student-assignment-services"}, {"title": "Customized Printing", "eyebrow": "CUSTOM", "desc": "Mugs, cards, stickers, frames, labels, personalized gifts and branded merchandise.", "image": "https://images.unsplash.com/photo-1682339374155-6fdc4869a75b?w=700&h=500&fit=crop&auto=format", "to": "/services/customized-printing"}, {"title": "Biometric & NADRA", "eyebrow": "FACILITATION", "desc": "NADRA e-Sahulat, biometric facilitation, CNIC, birth/death certificates and government applications.", "image": "https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=700&h=500&fit=crop&auto=format", "to": "/services/nadra-biometric-public-facilitation"}, {"title": "Legal Documentation", "eyebrow": "LEGAL", "desc": "Affidavits, agreements, power of attorney, attestation and official document preparation.", "image": "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=700&h=500&fit=crop&auto=format", "to": "/services/legal-documentation"}, {"title": "Business Services", "eyebrow": "BUSINESS", "desc": "Letterheads, salary certificates, business letters, bulk printing and office stationery.", "image": "https://images.unsplash.com/photo-1775163024488-e88e4a71179f?w=700&h=500&fit=crop&auto=format", "to": "/services/business-documentation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_grid'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'audiences', 'Who We Serve', 3, TRUE, '{"eyebrow": "WHO WE SERVE", "heading": "For Everyone in the Community", "items": [{"label": "Students", "desc": "School, college and university students for assignment printing, thesis, projects and academic submissions."}, {"label": "Individuals & Families", "desc": "Personal documentation, photographs, ID facilitation, frames and everyday printing needs."}, {"label": "Schools & Colleges", "desc": "Bulk institutional printing, stationery, forms, and documentation support for educational institutions."}, {"label": "Businesses & Offices", "desc": "Business documents, letterheads, visiting cards, rubber stamps and corporate printing."}, {"label": "General Public", "desc": "NADRA facilitation, biometric assistance, legal documents and everyday service needs."}, {"label": "Organizations", "desc": "Large-volume printing, customized branded materials and official documentation."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'audiences'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'principles', 'Our Approach', 4, TRUE, '{"eyebrow": "OUR APPROACH", "heading": "How We Work", "items": [{"title": "Convenience", "desc": "All services at one location. No running between providers — printing, documentation, biometric and customized products together."}, {"title": "Accessibility", "desc": "Online ordering means you can send your files from home, university or office. Walk in or order ahead."}, {"title": "Customized Solutions", "desc": "Every customer has unique requirements. We accommodate specific sizes, quantities, materials and formats."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'principles'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'location', 'Location', 5, TRUE, '{"eyebrow": "FIND US", "heading": "Visit Our Centre", "hours": "Open daily — visit us for all your printing and documentation needs.", "address": "Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi", "maps_url": "https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6", "badge_text": "H Block, North Nazimabad"}'::jsonb
FROM public.pages p
WHERE p.slug = '/about'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'location'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"eyebrow": "All Services", "heading_line1": "Everything We Can", "heading_line2": "Help You With.", "description": "12 service categories. One convenient location. Printing, documentation, customized products and public facilitation — all in H Block, North Nazimabad.", "pill_1": "12 Service Categories", "pill_2": "H Block, North Nazimabad"}'::jsonb
FROM public.pages p
WHERE p.slug = '/services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'final_cta', 'Final CTA', 1, TRUE, '{"eyebrow": "Ready to Start?", "heading_line1": "Get It Done.", "heading_line2": "Today.", "description": "Walk in or reach us online. We're here to help at every step.", "primary_label": "Order Online", "primary_url": "/order-online", "secondary_label": "WhatsApp Us"}'::jsonb
FROM public.pages p
WHERE p.slug = '/services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'final_cta'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"eyebrow": "GET IN TOUCH", "title_line1": "Visit, Call, WhatsApp", "title_line2": "or Send Your File.", "intro": "We''re here to help. Come to our shop in H Block, North Nazimabad — or reach us online.", "location_pill": "H Block, North Nazimabad", "background_image_url": "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1600&h=700&fit=crop&auto=format"}'::jsonb
FROM public.pages p
WHERE p.slug = '/contact'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'contact_info', 'Contact Information', 1, TRUE, '{"reach_us_heading": "Reach Us", "hours_label": "Opening Hours", "hours_text": "Open daily — visit us during business hours."}'::jsonb
FROM public.pages p
WHERE p.slug = '/contact'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'contact_info'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"eyebrow": "SEND YOUR FILE ONLINE", "title_line1": "Send Your File.", "title_line2": "We''ll Handle the Rest.", "intro": "Upload your document, assignment, image or design file. Tell us your requirements — we review, prepare, and complete your order."}'::jsonb
FROM public.pages p
WHERE p.slug = '/order-online'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_it_works', 'How It Works', 1, TRUE, '{"eyebrow": "SIMPLE PROCESS", "heading": "How It Works", "steps": [{"title": "Upload Your File", "desc": "Send your document, assignment, image, or design file through the form."}, {"title": "Share Requirements", "desc": "Specify size, quantity, color, paper type, and any special instructions."}, {"title": "We Prepare", "desc": "Our team reviews your file, confirms details, and prepares your order."}, {"title": "Collect or Deliver", "desc": "Pick up your completed order from our shop, or arrange for delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/order-online'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_it_works'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'rich_text', 'Privacy Policy Content', 0, TRUE, '{"page_title": "Privacy Policy", "introduction": "Mateen Documentation respects your privacy and is committed to protecting the personal information you provide when using our website, submitting an enquiry, placing an online order, contacting us through WhatsApp, or using our services.", "sections": [{"title": "Information We Collect", "paragraphs": ["We may collect information including:"], "bullets": ["Full name", "Phone number", "WhatsApp number", "Email address", "Service requirements", "Messages and enquiries", "Documents, images, PDFs or other files voluntarily uploaded through our website", "Order-related information submitted through our online forms"], "afterParagraphs": ["We only collect information that is necessary to respond to your enquiry, process your service request, communicate with you, or provide the requested service."]}, {"title": "Uploaded Files and Documents", "paragraphs": ["Files uploaded through our website may contain personal or confidential information. These files are used only for the purpose of reviewing, preparing, printing, processing or completing the service requested by the customer.", "Customers should only upload documents they are authorised to share."]}, {"title": "How We Use Your Information", "paragraphs": ["Information submitted to Mateen Documentation may be used to:"], "bullets": ["Respond to enquiries", "Process service and printing requests", "Prepare quotations", "Contact customers regarding their orders", "Provide customer support", "Complete requested documentation or printing services", "Improve our website and services"], "afterParagraphs": ["We do not sell or rent customer personal information to third parties."]}, {"title": "Third-Party Services", "paragraphs": ["Our website may use third-party services such as:"], "bullets": ["Email delivery providers", "Website hosting providers", "Google Maps", "WhatsApp", "Analytics or website performance services"], "afterParagraphs": ["These services may process limited information according to their own privacy policies."]}, {"title": "Data Security", "paragraphs": ["We take reasonable precautions to protect information submitted through our website. However, no internet-based system can guarantee absolute security."]}, {"title": "External Links", "paragraphs": ["Our website may contain links to external websites or services. Mateen Documentation is not responsible for the privacy practices or content of third-party websites."]}, {"title": "Your Information", "paragraphs": ["You may contact us if you would like to ask about personal information submitted through our website or request correction or deletion where reasonably applicable."]}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/privacy-policy'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'rich_text'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'rich_text', 'Terms & Conditions Content', 0, TRUE, '{"page_title": "Terms & Conditions", "introduction": "By accessing the Mateen Documentation website or submitting a service request, you agree to the following terms and conditions.", "sections": [{"title": "Services", "paragraphs": ["Mateen Documentation provides printing, photocopying, customized printing, documentation assistance, student-related printing services, business documentation, public facilitation and other related services.", "Availability of individual services may vary depending on requirements, documents provided and other circumstances."]}, {"title": "Customer Information", "paragraphs": ["Customers are responsible for providing accurate information, instructions and files required to complete their requested service.", "Mateen Documentation is not responsible for delays or errors caused by incorrect, incomplete or unclear information supplied by the customer."]}, {"title": "Uploaded Documents and Files", "paragraphs": ["Customers confirm that they have the right and authority to submit any documents, photographs, designs or other files uploaded or provided to Mateen Documentation.", "We reserve the right to refuse any request involving unlawful, inappropriate or unauthorised material."]}, {"title": "Printing and Customized Orders", "paragraphs": ["Customers should carefully confirm the following before final production:"], "bullets": ["Quantity", "Size", "Paper or material", "Colour requirements", "Design", "Content", "Finishing requirements"], "afterParagraphs": ["Minor colour differences may occur between digital screens and printed output due to differences in printers, materials, screens and colour reproduction."]}, {"title": "Payments", "paragraphs": ["Pricing may depend on the type, quantity, materials, complexity and requirements of the requested service.", "Where applicable, customers may be asked to confirm pricing or make payment before work begins."]}, {"title": "Turnaround Times", "paragraphs": ["Any estimated completion or delivery time is provided in good faith and may vary depending on workload, quantity, availability of materials, technical requirements or third-party processing."]}, {"title": "Documentation & Facilitation Services", "paragraphs": ["Mateen Documentation provides documentation preparation and facilitation assistance.", "Unless expressly stated otherwise, Mateen Documentation is not a government department, authority, law firm, insurer or official issuing body.", "Government, institutional or third-party approvals are subject to the relevant authority''s own procedures and cannot be guaranteed by Mateen Documentation."]}, {"title": "Errors and Corrections", "paragraphs": ["Customers should review information, spelling, names, numbers, layouts and other important details before approving final printing or document preparation whenever an approval opportunity is provided."]}, {"title": "Website Information", "paragraphs": ["We aim to keep information on the website accurate and current. However, service details, availability and content may be changed or updated without prior notice."]}, {"title": "Third-Party Links", "paragraphs": ["Our website may contain links to services such as Google Maps or WhatsApp. Mateen Documentation is not responsible for the operation, availability or policies of third-party platforms."]}, {"title": "Limitation of Liability", "paragraphs": ["To the extent permitted by applicable law, Mateen Documentation will not be responsible for indirect or consequential losses arising from the use of this website, customer-supplied information, third-party services or circumstances outside our reasonable control."]}, {"title": "Changes to These Terms", "paragraphs": ["These Terms & Conditions may be updated periodically. The latest version published on the website will apply."]}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/terms-and-conditions'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'rich_text'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Professional documentation assistance and drafting for individuals, families and businesses.", "note": "Mateen Documentation provides documentation assistance, drafting and facilitation. We are not a law firm. This service does not constitute legal advice.", "wa_message": "Hi, I need legal documentation assistance at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/legal-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Affidavits & Declarations"}, {"name": "Applications"}, {"name": "Official Letters"}, {"name": "Agreements"}, {"name": "Sale Agreements"}, {"name": "Purchase / Transfer Documentation"}, {"name": "Rent / Tenancy Agreements"}, {"name": "Partnership Agreements"}, {"name": "Power of Attorney Documentation"}, {"name": "Will Deeds"}, {"name": "Indemnity Bonds"}, {"name": "Undertakings"}, {"name": "General Legal Documentation"}, {"name": "Personal Documentation"}, {"name": "Legal Document Drafting"}, {"name": "Official Document Preparation"}, {"name": "Company Letters"}, {"name": "Official Documents"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/legal-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/legal-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Business Documentation", "to": "/services/business-documentation"}, {"label": "Vehicle Documentation", "to": "/services/vehicle-documentation"}, {"label": "NADRA / Biometric", "to": "/services/nadra-biometric-public-facilitation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/legal-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Motor insurance facilitation and documentation assistance for individuals and vehicle owners.", "note": "Mateen Documentation provides insurance facilitation and documentation assistance. We are not an insurance company and do not issue insurance policies.", "wa_message": "Hi, I need insurance facilitation at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/insurance-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Third-Party Motor Insurance Facilitation", "desc": "Facilitation assistance for third-party motor insurance."}, {"name": "Motor Insurance Documentation Assistance", "desc": "Help with insurance-related documents and paperwork."}, {"name": "Insurance Forms", "desc": "Assistance with filling and preparing insurance forms."}, {"name": "Supporting Insurance Documentation", "desc": "Preparation of supporting documents for insurance purposes."}, {"name": "Insurance Facilitation Services", "desc": "General insurance facilitation and document support."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/insurance-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/insurance-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Vehicle Documentation", "to": "/services/vehicle-documentation"}, {"label": "Legal Documentation", "to": "/services/legal-documentation"}, {"label": "Business Documentation", "to": "/services/business-documentation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/insurance-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Custom photo frames for every occasion and professional PVC card printing.", "note": "", "wa_message": "Hi, I need card or photo frame services at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Custom Photo Frames"}, {"name": "Personalized Photo Frames"}, {"name": "Family Photo Frames"}, {"name": "Couple Photo Frames"}, {"name": "Birthday Photo Frames"}, {"name": "Wedding Photo Frames"}, {"name": "Anniversary Photo Frames"}, {"name": "Event & Occasion Photo Frames"}, {"name": "Photo Collage Frames"}, {"name": "Promotional Photo Frames"}, {"name": "Business & Office Photo Frames"}, {"name": "Photo Frame Advertising"}, {"name": "Bulk Photo Frame Orders"}, {"name": "PVC Cards"}, {"name": "Glossy Cards"}, {"name": "Luster Cards"}, {"name": "ID Cards"}, {"name": "Customized Cards"}, {"name": "Photo Cards"}, {"name": "Personalized Cards"}, {"name": "Card Design & Printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Customized Printing", "to": "/services/customized-printing"}, {"label": "Design & Branding", "to": "/services/design-branding"}, {"label": "Bulk Printing", "to": "/services/bulk-printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/cards-photo-frames'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Professional business document drafting, formatting and preparation for offices and companies.", "note": "", "wa_message": "Hi, I need business documentation at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/business-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Company Letterheads"}, {"name": "Experience Certificates"}, {"name": "Salary Certificates"}, {"name": "Salary Slips"}, {"name": "Business Letters"}, {"name": "Business Applications"}, {"name": "Employment Documentation"}, {"name": "Office Documentation"}, {"name": "Customized Business Documents"}, {"name": "Professional Document Drafting"}, {"name": "Document Formatting"}, {"name": "Company Documents"}, {"name": "Official Certificates"}, {"name": "Customized Business Forms"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/business-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/business-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Legal Documentation", "to": "/services/legal-documentation"}, {"label": "Design & Branding", "to": "/services/design-branding"}, {"label": "Printing & Photocopy", "to": "/services/printing-photocopy"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/business-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Large-quantity printing for students, schools, colleges, offices and organizations.", "note": "", "wa_message": "Hi, I need bulk printing at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Bulk Black & White Printing"}, {"name": "Bulk Color Printing"}, {"name": "Bulk Photocopy"}, {"name": "Bulk Assignment Printing"}, {"name": "Bulk School / College Printing"}, {"name": "Bulk Business Printing"}, {"name": "Bulk Customized Printing"}, {"name": "Bulk Card Printing"}, {"name": "Bulk Sticker Printing"}, {"name": "Bulk Label Printing"}, {"name": "Custom Quantity Orders"}, {"name": "Custom Size Orders"}, {"name": "Custom Printing Requirements"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Printing & Photocopy", "to": "/services/printing-photocopy"}, {"label": "Student Assignment Services", "to": "/services/student-assignment-services"}, {"label": "Customized Printing", "to": "/services/customized-printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/bulk-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "NADRA e-Sahulat facilitation, biometric assistance and government application support.", "note": "Mateen Documentation provides facilitation and documentation assistance. We are not a government department unless specifically stated otherwise. We do not guarantee approval outcomes.", "wa_message": "Hi, I need NADRA/biometric facilitation at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/nadra-biometric-public-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "NADRA e-Sahulat Facilitation"}, {"name": "Biometric Facilitation"}, {"name": "Reference Biometric Facilitation"}, {"name": "CNIC Renewal Facilitation"}, {"name": "CRC / Child Registration Certificate Facilitation"}, {"name": "Birth Certificate Facilitation"}, {"name": "Death Certificate Facilitation"}, {"name": "Nikah Nama Facilitation"}, {"name": "Other Public Facilitation"}, {"name": "Government Application Facilitation"}, {"name": "Private Application Facilitation"}, {"name": "Online Form Filling"}, {"name": "Online Application Assistance"}, {"name": "Document Upload Facilitation"}, {"name": "Document Attestation Preparation & Facilitation"}, {"name": "General Documentation Facilitation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/nadra-biometric-public-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/nadra-biometric-public-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Legal Documentation", "to": "/services/legal-documentation"}, {"label": "Vehicle Documentation", "to": "/services/vehicle-documentation"}, {"label": "Business Documentation", "to": "/services/business-documentation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/nadra-biometric-public-facilitation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Office, school, business and customized stationery — all available at one location.", "note": "", "wa_message": "Hi, I need stationery items at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/stationery'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Office Stationery", "desc": "Pens, files, folders, registers and standard office supplies."}, {"name": "School Stationery", "desc": "Notebooks, copies, pencils and general school supplies."}, {"name": "Business Stationery", "desc": "Branded and unbranded stationery for business use."}, {"name": "Customized Stationery", "desc": "Personalized stationery items as per your specifications."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/stationery'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/stationery'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Business Documentation", "to": "/services/business-documentation"}, {"label": "Design & Branding", "to": "/services/design-branding"}, {"label": "Printing & Photocopy", "to": "/services/printing-photocopy"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/stationery'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Fast, reliable assignment and academic printing services for school, college and university students.", "note": "", "wa_message": "Hi, I need student assignment printing at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/student-assignment-services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Print School Assignments"}, {"name": "College Assignments"}, {"name": "University Assignments"}, {"name": "Assignment Typing"}, {"name": "Assignment Editing"}, {"name": "Assignment Formatting"}, {"name": "Assignment Printing"}, {"name": "Project Printing"}, {"name": "PDF Assignment Preparation"}, {"name": "English & Urdu Typing"}, {"name": "Scanning"}, {"name": "Digital File Conversion"}, {"name": "Customized Student Requirements"}, {"name": "Online Assignment Orders"}, {"name": "Bulk Academic Printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/student-assignment-services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/student-assignment-services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Printing & Photocopy", "to": "/services/printing-photocopy"}, {"label": "Bulk Printing", "to": "/services/bulk-printing"}, {"label": "Design & Branding", "to": "/services/design-branding"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/student-assignment-services'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Make it personal — customized mugs, cards, gifts, stickers and more for every occasion.", "note": "", "wa_message": "Hi, I need customized printing at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/customized-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Customized Mugs"}, {"name": "Customized Love Cards"}, {"name": "Personalized Cards"}, {"name": "Customized Designs"}, {"name": "Customized Stickers"}, {"name": "Customized Labels"}, {"name": "Customized Photo Printing"}, {"name": "Personalized Printing"}, {"name": "Customized Products"}, {"name": "Customized Gifts"}, {"name": "Event & Occasion Printing"}, {"name": "Bulk Customized Orders"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/customized-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/customized-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Cards & Photo Frames", "to": "/services/cards-photo-frames"}, {"label": "Design & Branding", "to": "/services/design-branding"}, {"label": "Bulk Printing", "to": "/services/bulk-printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/customized-printing'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "High-quality printing for individuals, students, offices and businesses. Color and B&W — any size, any quantity.", "note": "", "wa_message": "Hi, I need printing services at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/printing-photocopy'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Black & White Printing"}, {"name": "Color Printing"}, {"name": "Black & White Photocopy"}, {"name": "Color Photocopy"}, {"name": "A4 Printing"}, {"name": "A3 Printing"}, {"name": "Custom Size Printing"}, {"name": "Single Printing"}, {"name": "Bulk Printing"}, {"name": "Glossy Printing"}, {"name": "Photo Printing"}, {"name": "Luster Printing"}, {"name": "Sticker Printing"}, {"name": "Vinyl Printing"}, {"name": "Label Printing"}, {"name": "Lamination"}, {"name": "Scanning"}, {"name": "Typing"}, {"name": "Composing"}, {"name": "PDF Creation & Editing"}, {"name": "Document Formatting"}, {"name": "Digital File Conversion"}, {"name": "Passport Size Photograph Printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/printing-photocopy'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/printing-photocopy'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Student Assignments", "to": "/services/student-assignment-services"}, {"label": "Bulk Printing", "to": "/services/bulk-printing"}, {"label": "Design & Branding", "to": "/services/design-branding"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/printing-photocopy'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Vehicle sale agreements, transfer documentation, file loss facilitation and related services.", "note": "", "wa_message": "Hi, I need vehicle documentation assistance at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/vehicle-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Vehicle Sale Agreement / Transfer Documents", "desc": "Preparation and drafting of vehicle sale agreements."}, {"name": "Vehicle Ownership & Transfer Facilitation", "desc": "Assistance with ownership transfer documentation."}, {"name": "Vehicle File Loss Documentation Facilitation", "desc": "Support for lost vehicle file documentation processes."}, {"name": "Duplicate Sale Invoice / Sale Certificate Facilitation", "desc": "Assistance with duplicate sale invoice documentation."}, {"name": "Other Vehicle Documentation Facilitation", "desc": "General vehicle-related document assistance."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/vehicle-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/vehicle-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Legal Documentation", "to": "/services/legal-documentation"}, {"label": "Insurance Facilitation", "to": "/services/insurance-facilitation"}, {"label": "Business Documentation", "to": "/services/business-documentation"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/vehicle-documentation'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'hero', 'Hero', 0, TRUE, '{"subtitle": "Professional design and print services for businesses, offices and organizations.", "note": "", "wa_message": "Hi, I need design and branding services at Mateen Documentation."}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/design-branding'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'hero'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'services_list', 'Available Services', 1, TRUE, '{"items": [{"name": "Visiting Card Design & Printing"}, {"name": "Letterhead Design"}, {"name": "Company Profile"}, {"name": "Business Document Design"}, {"name": "Flyers"}, {"name": "Brochures"}, {"name": "Posters"}, {"name": "Promotional Material"}, {"name": "Stickers"}, {"name": "Labels"}, {"name": "Certificate Design"}, {"name": "Customized Forms"}, {"name": "Basic Social Media Creatives"}, {"name": "Customized Business Designs"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/design-branding'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'services_list'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'how_steps', 'How We Help', 2, TRUE, '{"steps": [{"num": "01", "title": "Send Your File", "desc": "Upload or WhatsApp your document — we accept photos, scans, or digital files."}, {"num": "02", "title": "Tell Us Your Needs", "desc": "Specify size, quantity, color, material, and any special instructions."}, {"num": "03", "title": "We Prepare It", "desc": "Our experienced team handles your order with precision and care."}, {"num": "04", "title": "Collect or Get Delivered", "desc": "Pick up from our H-Block office or arrange convenient delivery."}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/design-branding'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'how_steps'
  );

INSERT INTO public.page_sections (page_id, type, label, order_index, is_visible, content)
SELECT p.id, 'related', 'Related Services', 3, TRUE, '{"items": [{"label": "Business Documentation", "to": "/services/business-documentation"}, {"label": "Printing & Photocopy", "to": "/services/printing-photocopy"}, {"label": "Customized Printing", "to": "/services/customized-printing"}]}'::jsonb
FROM public.pages p
WHERE p.slug = '/services/design-branding'
  AND NOT EXISTS (
    SELECT 1 FROM public.page_sections s
    WHERE s.page_id = p.id AND s.type = 'related'
  );

COMMIT;
