import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  absoluteUrl,
  getSeoDocument,
  INDEXABLE_ROUTES,
  SITE_URL,
  renderPage,
} from '../.prerender/entry-prerender.js';

const root = process.cwd();
const distDirectory = path.join(root, 'dist');
const template = await readFile(path.join(distDirectory, 'index.html'), 'utf8');

// ─── Fetch CMS data from Supabase at build time ──────────────────────────────

async function fetchCmsData() {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !KEY) {
    console.warn('[prerender] No Supabase credentials — using static fallback content.');
    return null;
  }

  const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    Accept: 'application/json',
  };

  async function get(table, query = '') {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, { headers });
      if (!res.ok) {
        console.warn(`[prerender] Supabase ${table} returned ${res.status}`);
        return [];
      }
      return res.json();
    } catch (err) {
      console.warn(`[prerender] Failed to fetch ${table}:`, err.message);
      return [];
    }
  }

  try {
    const [
      siteSettingsArr,
      headerSettingsArr,
      footerSettingsArr,
      navigationItems,
      seoSettings,
      customScripts,
      customMetaTags,
      customCssArr,
      publishedPages,
      allSections,
      cmsServices,
      mediaAssets,
    ] = await Promise.all([
      get('site_settings', '?limit=1'),
      get('header_settings', '?limit=1'),
      get('footer_settings', '?limit=1'),
      get('navigation_items', '?is_enabled=eq.true&order=order_index.asc'),
      get('seo_settings', '?select=*'),
      get('custom_scripts', '?is_active=eq.true&order=priority.asc,name.asc'),
      get('custom_meta_tags', '?is_active=eq.true'),
      get('custom_css', '?is_active=eq.true&limit=1'),
      // Fetch published pages with slug so we can map sections
      get('pages', '?status=eq.published&select=id,slug,status,is_protected'),
      // All sections ordered by page_id + order_index
      get('page_sections', '?is_visible=eq.true&order=order_index.asc&select=id,page_id,type,label,order_index,is_visible,content'),
      get('services', '?is_active=eq.true&order=order_index.asc'),
      get('media_assets', '?select=id,public_url,source_url,type,alt_text,title'),
    ]);

    // Build pageSections map: slug → sections[]
    const pageSections = {};
    for (const page of publishedPages) {
      const slug = page.slug?.trim() || null;
      if (!slug) continue;
      const sections = allSections.filter(s => s.page_id === page.id);
      pageSections[slug] = sections;
    }

    const cmsData = {
      siteSettings: siteSettingsArr[0] ?? null,
      headerSettings: headerSettingsArr[0] ?? null,
      footerSettings: footerSettingsArr[0] ?? null,
      navigationItems,
      seoSettings,
      customScripts,
      customMetaTags,
      customCss: customCssArr[0] ?? null,
      publishedPages,
      pageSections,
      cmsServices,
      mediaAssets,
    };

    console.log(
      `[prerender] CMS data loaded: ${seoSettings.length} SEO entries, ` +
      `${customScripts.length} scripts, ${publishedPages.length} published pages, ` +
      `${allSections.length} sections, ${cmsServices.length} services, ${mediaAssets.length} media assets.`
    );
    return cmsData;
  } catch (err) {
    console.warn('[prerender] CMS data fetch failed — using static fallback:', err.message);
    return null;
  }
}

const cmsData = await fetchCmsData();

// ─── Safe public snapshot for browser hydration ──────────────────────────────
// Excludes server-side only data: scripts, meta tags, custom CSS, seo_settings,
// service role keys, deploy hooks, audit logs, user data, draft content.

function buildPublicSnapshot(data) {
  if (!data) return null;
  return {
    siteSettings: data.siteSettings,
    headerSettings: data.headerSettings,
    footerSettings: data.footerSettings,
    navigationItems: data.navigationItems,
    pageSections: data.pageSections,
    cmsServices: data.cmsServices,
    mediaAssets: data.mediaAssets,
  };
}

const publicSnapshot = buildPublicSnapshot(cmsData);

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Escape JSON for safe inline <script> injection:
 * - Escapes </ to prevent </script> from breaking out
 * - Escapes <!-- to prevent HTML comment injection
 */
function escapeJsonForScript(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function getCmsSeoForPath(pathname) {
  if (!cmsData?.seoSettings?.length) return null;
  const slug = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return cmsData.seoSettings.find(s => s.page_slug === slug) ?? null;
}

function seoTags(pathname) {
  const { entry, canonical, robots, socialImage, socialImageAlt, structuredData } =
    getSeoDocument(pathname);

  const cms = getCmsSeoForPath(pathname);

  const title = cms?.title || entry.title;
  const description = cms?.description || entry.description;
  const robotsValue = cms
    ? (cms.noindex ? 'noindex, nofollow' : 'index, follow')
    : robots;
  const canonicalUrl = cms?.canonical_url || canonical;
  const ogTitle = cms?.og_title || title;
  const ogDesc = cms?.og_description || description;
  const ogImage = cms?.og_image || socialImage;
  const twTitle = cms?.twitter_title || title;
  const twDesc = cms?.twitter_description || description;
  const twImage = cms?.twitter_image || socialImage;
  const faviconUrl = cmsData?.siteSettings?.favicon_url || '/favicon.png';

  const schema = cms?.custom_jsonld
    ? cms.custom_jsonld.replace(/</g, '\\u003c')
    : JSON.stringify(structuredData).replace(/</g, '\\u003c');

  const customMetaHtml = (cmsData?.customMetaTags ?? []).map(tag => {
    if (tag.name) {
      return `<meta name="${escapeHtml(tag.name)}" content="${escapeHtml(tag.content)}" />`;
    }
    if (tag.property) {
      return `<meta property="${escapeHtml(tag.property)}" content="${escapeHtml(tag.content)}" />`;
    }
    return '';
  }).filter(Boolean).join('\n    ');

  const customCssHtml = cmsData?.customCss?.css
    ? `<style id="cms-custom-css">\n${cmsData.customCss.css}\n</style>`
    : '';

  const headStartScripts = scriptsByLocation('head_start');
  const headEndScripts = scriptsByLocation('head_end');

  // Inject the safe public CMS snapshot for browser hydration
  const cmsDataScript = publicSnapshot
    ? `<script id="__CMS_DATA__" type="application/json">${escapeJsonForScript(publicSnapshot)}</script>`
    : '';

  return `
    ${headStartScripts}
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robotsValue}" />
    <meta name="googlebot" content="${robotsValue}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="icon" href="${faviconUrl}" />
    <link rel="apple-touch-icon" href="${faviconUrl}" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}" />
    <meta property="og:site_name" content="${escapeHtml(cmsData?.siteSettings?.business_name ?? 'Mateen Documentation')}" />
    <meta property="og:locale" content="en_PK" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(twTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(twDesc)}" />
    <meta name="twitter:image" content="${twImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}" />
    ${customMetaHtml}
    <noscript><style>
      header[style*="opacity:0;"],
      main [style*="opacity:0;"],
      footer [style*="opacity:0;"] {
        opacity: 1 !important;
        transform: none !important;
      }
    </style></noscript>
    <script id="seo-jsonld" type="application/ld+json">${schema}</script>
    ${customCssHtml}
    ${cmsDataScript}
    ${headEndScripts}`;
}

function scriptsByLocation(location) {
  const scripts = (cmsData?.customScripts ?? []).filter(s => s.location === location && s.is_active);
  return scripts.map(s => s.content).join('\n');
}

function cleanTemplate(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<meta\s+name="googlebot"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<script\s+id="seo-jsonld"[\s\S]*?<\/script>/gi, '')
    .replace(/<script\s+id="__CMS_DATA__"[\s\S]*?<\/script>/gi, '');
}

async function writePrerenderedPage(pathname, outputPath) {
  const content = await renderPage(pathname, cmsData ?? undefined);
  const bodyStartScripts = scriptsByLocation('body_start');
  const bodyEndScripts = scriptsByLocation('body_end');

  let html = cleanTemplate(template)
    .replace('</head>', `${seoTags(pathname)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);

  if (bodyStartScripts) {
    html = html.replace(/<body([^>]*)>/, `<body$1>\n${bodyStartScripts}`);
  }
  if (bodyEndScripts) {
    html = html.replace('</body>', `${bodyEndScripts}\n</body>`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

// ─── Render all public routes ────────────────────────────────────────────────

for (const pathname of INDEXABLE_ROUTES) {
  const outputPath =
    pathname === '/'
      ? path.join(distDirectory, 'index.html')
      : path.join(distDirectory, pathname.slice(1), 'index.html');
  await writePrerenderedPage(pathname, outputPath);
}

await writePrerenderedPage('/404', path.join(distDirectory, '404.html'));

// ─── Sitemap from CMS state ──────────────────────────────────────────────────

function buildSitemapRoutes() {
  if (cmsData?.seoSettings?.length) {
    return INDEXABLE_ROUTES.filter(pathname => {
      const slug = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
      const cms = cmsData.seoSettings.find(s => s.page_slug === slug);
      if (!cms) return true;
      return !cms.noindex && cms.sitemap_include !== false;
    });
  }
  return INDEXABLE_ROUTES;
}

const sitemapRoutes = buildSitemapRoutes();
const sitemapUrls = sitemapRoutes.map(
  pathname => `  <url><loc>${absoluteUrl(pathname)}</loc></url>`,
).join('\n');
await writeFile(
  path.join(distDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
);
await writeFile(
  path.join(distDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

await rm(path.join(root, '.prerender'), { recursive: true, force: true });

console.log(`[prerender] Done — ${INDEXABLE_ROUTES.length} pages, ${sitemapRoutes.length} in sitemap.`);
