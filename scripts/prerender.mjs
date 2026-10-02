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

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoTags(pathname) {
  const { entry, canonical, robots, socialImage, socialImageAlt, structuredData } =
    getSeoDocument(pathname);
  const schema = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  return `
    <title>${escapeHtml(entry.title)}</title>
    <meta name="description" content="${escapeHtml(entry.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <meta property="og:title" content="${escapeHtml(entry.title)}" />
    <meta property="og:description" content="${escapeHtml(entry.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${socialImageAlt}" />
    <meta property="og:site_name" content="Mateen Documentation" />
    <meta property="og:locale" content="en_PK" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(entry.title)}" />
    <meta name="twitter:description" content="${escapeHtml(entry.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="${socialImageAlt}" />
    <noscript><style>
      header[style*="opacity:0;"],
      main [style*="opacity:0;"],
      footer [style*="opacity:0;"] {
        opacity: 1 !important;
        transform: none !important;
      }
    </style></noscript>
    <script id="seo-jsonld" type="application/ld+json">${schema}</script>`;
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
    .replace(/<script\s+id="seo-jsonld"[\s\S]*?<\/script>/gi, '');
}

async function writePrerenderedPage(pathname, outputPath) {
  const content = await renderPage(pathname);
  const html = cleanTemplate(template)
    .replace('</head>', `${seoTags(pathname)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

for (const pathname of INDEXABLE_ROUTES) {
  const outputPath =
    pathname === '/'
      ? path.join(distDirectory, 'index.html')
      : path.join(distDirectory, pathname.slice(1), 'index.html');
  await writePrerenderedPage(pathname, outputPath);
}

await writePrerenderedPage('/404', path.join(distDirectory, '404.html'));

const sitemapUrls = INDEXABLE_ROUTES.map(
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
