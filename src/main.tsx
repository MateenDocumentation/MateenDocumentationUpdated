import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';
import { CmsDataProvider } from './cms/CmsContext';
import type { CmsPublicSnapshot } from './cms/CmsContext';

/**
 * Read the CMS snapshot injected at prerender time.
 * The snapshot is serialized as JSON inside a <script id="__CMS_DATA__" type="application/json"> tag.
 * It contains only safe public data — no service role keys, no draft content, no admin records.
 */
function readCmsSnapshot(): CmsPublicSnapshot | null {
  try {
    const el = document.getElementById('__CMS_DATA__');
    if (!el?.textContent) return null;
    return JSON.parse(el.textContent) as CmsPublicSnapshot;
  } catch {
    return null;
  }
}

const rootEl = document.getElementById('root')!;
const cmsSnapshot = readCmsSnapshot();

const app = (
  <React.StrictMode>
    {cmsSnapshot ? (
      <CmsDataProvider data={cmsSnapshot}>
        <App />
      </CmsDataProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

// Use hydrateRoot when the page was prerendered (root has child nodes),
// createRoot otherwise (development / non-prerendered environments).
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}
