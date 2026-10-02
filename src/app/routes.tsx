import { createBrowserRouter } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router';
import { SEO_CONFIG } from '../seo/config';

export function Root() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export function HydrateFallback() {
  return null;
}

const notFound = SEO_CONFIG['/404'];
const pageRoutes = Object.entries(SEO_CONFIG)
  .filter(([path]) => path !== '/404')
  .map(([path, entry]) => ({
    ...(path === '/' ? { index: true as const } : { path: path.slice(1) }),
    lazy: () => entry.load().then(module => ({ Component: module.default })),
  }));

export const routeDefinitions = [
  {
    path: '/',
    Component: Root,
    HydrateFallback,
    children: [
      ...pageRoutes,
      { path: '*', lazy: () => notFound.load().then(module => ({ Component: module.default })) },
    ],
  },
];

export const router = createBrowserRouter(routeDefinitions);
