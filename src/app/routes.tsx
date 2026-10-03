import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router';
import { SEO_CONFIG } from '../seo/config';
import { AuthProvider } from '../admin/context/AuthContext';
import { ToastProvider } from '../admin/components/Toast';

// ─── Public website ─────────────────────────────────────────────────────────

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

// ─── Admin pages (lazy loaded, never prerendered) ──────────────────────────

const AdminLayout = lazy(() => import('../admin/components/AdminLayout'));
const ProtectedRoute = lazy(() => import('../admin/components/ProtectedRoute'));
const Login = lazy(() => import('../admin/pages/Login'));
const Dashboard = lazy(() => import('../admin/pages/Dashboard'));
const HeaderManager = lazy(() => import('../admin/pages/HeaderManager'));
const FooterManager = lazy(() => import('../admin/pages/FooterManager'));
const Navigation = lazy(() => import('../admin/pages/Navigation'));
const Pages = lazy(() => import('../admin/pages/Pages'));
const PageEditor = lazy(() => import('../admin/pages/PageEditor'));
const MediaLibrary = lazy(() => import('../admin/pages/MediaLibrary'));
const Services = lazy(() => import('../admin/pages/Services'));
const SEO = lazy(() => import('../admin/pages/SEO'));
const Redirects = lazy(() => import('../admin/pages/Redirects'));
const Scripts = lazy(() => import('../admin/pages/Scripts'));
const MetaTags = lazy(() => import('../admin/pages/MetaTags'));
const CustomCSS = lazy(() => import('../admin/pages/CustomCSS'));
const Preview = lazy(() => import('../admin/pages/Preview'));
const Settings = lazy(() => import('../admin/pages/Settings'));
const Users = lazy(() => import('../admin/pages/Users'));
const RevisionHistory = lazy(() => import('../admin/pages/RevisionHistory'));

function AdminRoot() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#071A2B] border-t-transparent rounded-full animate-spin" /></div>}>
          <Outlet />
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}

function SuperAdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute requiredRole="SUPER_ADMIN">{children}</ProtectedRoute>
    </Suspense>
  );
}

const adminRoutes = [
  {
    path: '/admin',
    Component: AdminRoot,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'login', element: <Suspense fallback={null}><Login /></Suspense> },
      {
        path: 'dashboard',
        element: <Protected><Suspense fallback={null}><AdminLayout /></Suspense></Protected>,
        children: [{ index: true, element: <Suspense fallback={null}><Dashboard /></Suspense> }],
      },
      {
        Component: () => <Protected><Suspense fallback={null}><AdminLayout /></Suspense></Protected>,
        children: [
          { path: 'header', element: <Suspense fallback={null}><HeaderManager /></Suspense> },
          { path: 'footer', element: <Suspense fallback={null}><FooterManager /></Suspense> },
          { path: 'navigation', element: <Suspense fallback={null}><Navigation /></Suspense> },
          { path: 'pages', element: <Suspense fallback={null}><Pages /></Suspense> },
          { path: 'pages/:id', element: <Suspense fallback={null}><PageEditor /></Suspense> },
          { path: 'media', element: <Suspense fallback={null}><MediaLibrary /></Suspense> },
          { path: 'services', element: <Suspense fallback={null}><Services /></Suspense> },
          { path: 'seo', element: <Suspense fallback={null}><SEO /></Suspense> },
          { path: 'redirects', element: <Suspense fallback={null}><Redirects /></Suspense> },
          { path: 'settings', element: <Suspense fallback={null}><Settings /></Suspense> },
          { path: 'history', element: <Suspense fallback={null}><RevisionHistory /></Suspense> },
          { path: 'scripts', element: <SuperAdminOnly><Suspense fallback={null}><Scripts /></Suspense></SuperAdminOnly> },
          { path: 'meta-tags', element: <SuperAdminOnly><Suspense fallback={null}><MetaTags /></Suspense></SuperAdminOnly> },
          { path: 'custom-css', element: <SuperAdminOnly><Suspense fallback={null}><CustomCSS /></Suspense></SuperAdminOnly> },
          { path: 'preview/:id', element: <Suspense fallback={null}><Preview /></Suspense> },
          { path: 'users', element: <SuperAdminOnly><Suspense fallback={null}><Users /></Suspense></SuperAdminOnly> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter([...routeDefinitions, ...adminRoutes]);
