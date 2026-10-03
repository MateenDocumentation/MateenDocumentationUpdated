import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { getSeoEntry } from './seo/config';
import { CmsDataProvider } from './cms/CmsContext';
import type { CmsData } from './cms/CmsContext';

export {
  absoluteUrl,
  getSeoDocument,
  INDEXABLE_ROUTES,
  SITE_NAME,
  SITE_URL,
} from './seo/config';

export async function renderPage(pathname: string, cmsData?: CmsData) {
  const Page = (await getSeoEntry(pathname).load()).default;
  const inner = (
    <StaticRouter location={pathname}>
      <Page />
    </StaticRouter>
  );
  return renderToString(
    cmsData ? <CmsDataProvider data={cmsData}>{inner}</CmsDataProvider> : inner
  );
}
