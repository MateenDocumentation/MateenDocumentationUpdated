import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { getSeoEntry } from './seo/config';

export {
  absoluteUrl,
  getSeoDocument,
  INDEXABLE_ROUTES,
  SITE_NAME,
  SITE_URL,
} from './seo/config';

export async function renderPage(pathname: string) {
  const Page = (await getSeoEntry(pathname).load()).default;
  return renderToString(
    <StaticRouter location={pathname}>
      <Page />
    </StaticRouter>,
  );
}
