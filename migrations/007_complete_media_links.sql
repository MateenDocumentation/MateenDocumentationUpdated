-- 007_complete_media_links.sql
-- Completes CMS media linkage for live frontend assets without changing page layout.
BEGIN;

-- Helper pattern: prefer imported Media Library public_url when source_url exists.

-- Service detail hero images: make the live hero image explicitly editable in page_sections.
WITH service_hero(slug, source_url) AS (
  VALUES
    ('/services/printing-photocopy', 'https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/business-documentation', 'https://images.unsplash.com/photo-1631540700410-dd61be60e395?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/stationery', 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=600&fit=crop&auto=format'),
    ('/services/design-branding', 'https://images.unsplash.com/photo-1642480532034-362360552ccb?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/bulk-printing', 'https://images.unsplash.com/photo-1693031630369-bd429a57f115?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/nadra-biometric-public-facilitation', 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=600&fit=crop&auto=format'),
    ('/services/customized-printing', 'https://images.unsplash.com/photo-1492051337034-f05bb38b404b?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/insurance-facilitation', 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&auto=format'),
    ('/services/student-assignment-services', 'https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('/services/vehicle-documentation', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format'),
    ('/services/legal-documentation', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&auto=format'),
    ('/services/cards-photo-frames', 'https://images.unsplash.com/photo-1546696683-f2503ebc62c9?w=1400&h=900&fit=crop&auto=format&q=85')
), resolved AS (
  SELECT sh.slug,
         COALESCE(ma.public_url, sh.source_url) AS url
  FROM service_hero sh
  LEFT JOIN public.media_assets ma ON ma.source_url = sh.source_url
)
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{image_url}', to_jsonb(resolved.url), true)
FROM public.pages p, resolved
WHERE ps.page_id = p.id
  AND ps.type = 'hero'
  AND p.slug = resolved.slug;

-- Keep services table image_url aligned too (Services listing + other service cards).
WITH service_image(slug, source_url) AS (
  VALUES
    ('printing-photocopy', 'https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('business-documentation', 'https://images.unsplash.com/photo-1631540700410-dd61be60e395?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('stationery', 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=600&fit=crop&auto=format'),
    ('design-branding', 'https://images.unsplash.com/photo-1642480532034-362360552ccb?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('bulk-printing', 'https://images.unsplash.com/photo-1693031630369-bd429a57f115?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('nadra-biometric-public-facilitation', 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=600&fit=crop&auto=format'),
    ('customized-printing', 'https://images.unsplash.com/photo-1492051337034-f05bb38b404b?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('insurance-facilitation', 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&auto=format'),
    ('student-assignment-services', 'https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=1400&h=900&fit=crop&auto=format&q=85'),
    ('vehicle-documentation', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format'),
    ('legal-documentation', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&auto=format'),
    ('cards-photo-frames', 'https://images.unsplash.com/photo-1546696683-f2503ebc62c9?w=1400&h=900&fit=crop&auto=format&q=85')
), resolved AS (
  SELECT si.slug, COALESCE(ma.public_url, si.source_url) AS url
  FROM service_image si
  LEFT JOIN public.media_assets ma ON ma.source_url = si.source_url
)
UPDATE public.services s
SET image_url = resolved.url
FROM resolved
WHERE s.slug = resolved.slug;

-- About + Contact hero backgrounds: replace seeded external URL with imported Media Library URL when available.
WITH hero_map(slug, source_url) AS (
  VALUES
    ('/about', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&auto=format'),
    ('/contact', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1600&h=700&fit=crop&auto=format')
), resolved AS (
  SELECT hm.slug, COALESCE(ma.public_url, hm.source_url) AS url
  FROM hero_map hm
  LEFT JOIN public.media_assets ma ON ma.source_url = hm.source_url
)
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{background_image_url}', to_jsonb(resolved.url), true)
FROM public.pages p, resolved
WHERE ps.page_id = p.id
  AND ps.type = 'hero'
  AND p.slug = resolved.slug;

-- Home: populate every image field that the current frontend renders.
WITH home AS (SELECT id FROM public.pages WHERE slug='/' LIMIT 1)
UPDATE public.page_sections ps SET content = ps.content || jsonb_build_object(
  'image_main', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=600&h=1100&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=600&h=1100&fit=crop&auto=format'),
  'image_color', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=540&h=900&fit=crop&auto=format&q=85' LIMIT 1), 'https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=540&h=900&fit=crop&auto=format&q=85'),
  'image_detail', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1581079289196-67865ea83118?w=820&h=440&fit=crop&auto=format&q=85' LIMIT 1), 'https://images.unsplash.com/photo-1581079289196-67865ea83118?w=820&h=440&fit=crop&auto=format&q=85')
) FROM home WHERE ps.page_id=home.id AND ps.type='printing_feature';

WITH home AS (SELECT id FROM public.pages WHERE slug='/' LIMIT 1)
UPDATE public.page_sections ps SET content = ps.content || jsonb_build_object(
  'image_main', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=640&h=700&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=640&h=700&fit=crop&auto=format'),
  'image_secondary', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1631557777127-6495c07ba6b9?w=440&h=360&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1631557777127-6495c07ba6b9?w=440&h=360&fit=crop&auto=format'),
  'image_tertiary', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1772396867158-e26d9e6256b2?w=440&h=480&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1772396867158-e26d9e6256b2?w=440&h=480&fit=crop&auto=format'),
  'image_wide', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1773453219454-9940ac4256cf?w=600&h=320&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1773453219454-9940ac4256cf?w=600&h=320&fit=crop&auto=format')
) FROM home WHERE ps.page_id=home.id AND ps.type='academic_feature';

WITH home AS (SELECT id FROM public.pages WHERE slug='/' LIMIT 1)
UPDATE public.page_sections ps SET content = ps.content || jsonb_build_object(
  'image_main', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1680337673561-531bca1cf5b7?w=560&h=700&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1680337673561-531bca1cf5b7?w=560&h=700&fit=crop&auto=format'),
  'image_2', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=480&h=320&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=480&h=320&fit=crop&auto=format'),
  'image_3', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1572512083030-840a84affc83?w=480&h=320&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1572512083030-840a84affc83?w=480&h=320&fit=crop&auto=format'),
  'image_4', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1780444078356-5ca1e9efe6b8?w=440&h=300&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1780444078356-5ca1e9efe6b8?w=440&h=300&fit=crop&auto=format'),
  'image_5', COALESCE((SELECT public_url FROM public.media_assets WHERE source_url='https://images.unsplash.com/photo-1617912760717-06f3976cf18c?w=400&h=280&fit=crop&auto=format' LIMIT 1), 'https://images.unsplash.com/photo-1617912760717-06f3976cf18c?w=400&h=280&fit=crop&auto=format')
) FROM home WHERE ps.page_id=home.id AND ps.type='customized_printing';

-- Convert existing Who We Serve panel image values to imported public URLs where possible.
WITH home AS (SELECT id FROM public.pages WHERE slug='/' LIMIT 1), target AS (
  SELECT ps.id, ps.content,
    (SELECT jsonb_agg(
      CASE WHEN ma.public_url IS NOT NULL THEN jsonb_set(panel, '{image}', to_jsonb(ma.public_url), true) ELSE panel END
      ORDER BY ord
    )
    FROM jsonb_array_elements(ps.content->'panels') WITH ORDINALITY AS x(panel, ord)
    LEFT JOIN public.media_assets ma ON ma.source_url = panel->>'image') AS panels
  FROM public.page_sections ps, home
  WHERE ps.page_id=home.id AND ps.type='who_we_serve'
)
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{panels}', target.panels, true)
FROM target
WHERE ps.id=target.id AND target.panels IS NOT NULL;

-- About Who We Are image + About services grid images -> imported Media Library URLs.
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{image}', to_jsonb(ma.public_url), true)
FROM public.pages p, public.media_assets ma
WHERE ps.page_id=p.id AND p.slug='/about' AND ps.type='who_we_are'
  AND ma.source_url = ps.content->>'image';

WITH target AS (
  SELECT ps.id,
    (SELECT jsonb_agg(
      CASE WHEN ma.public_url IS NOT NULL THEN jsonb_set(item, '{image}', to_jsonb(ma.public_url), true) ELSE item END
      ORDER BY ord
    )
    FROM jsonb_array_elements(ps.content->'items') WITH ORDINALITY AS x(item, ord)
    LEFT JOIN public.media_assets ma ON ma.source_url = item->>'image') AS items
  FROM public.page_sections ps
  JOIN public.pages p ON p.id=ps.page_id
  WHERE p.slug='/about' AND ps.type='services_grid'
)
UPDATE public.page_sections ps
SET content = jsonb_set(ps.content, '{items}', target.items, true)
FROM target
WHERE ps.id=target.id AND target.items IS NOT NULL;

COMMIT;
