import type { ComponentType } from 'react';

export const SITE_URL = 'https://mateendocumentation.com';
export const SITE_NAME = 'Mateen Documentation';
export const DEFAULT_SOCIAL_IMAGE =
  'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1200&h=630&fit=crop&auto=format&q=82';
export const SITE_ICON = '/favicon.png';
export const SITE_ICON_URL = `${SITE_URL}${SITE_ICON}`;
export const SOCIAL_IMAGE_ALT = `${SITE_NAME} printing and documentation services`;

type RouteModule = { default: ComponentType };
type RouteLoader = () => Promise<RouteModule>;

export type SeoPageType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'Service';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type SeoEntry = {
  title: string;
  description: string;
  type: SeoPageType;
  load: RouteLoader;
  index?: boolean;
  breadcrumbs: BreadcrumbItem[];
  serviceName?: string;
};

const homeCrumb = { name: 'Home', path: '/' };
const servicesCrumb = { name: 'Services', path: '/services' };

export const SEO_CONFIG: Record<string, SeoEntry> = {
  '/': {
    load: () => import('../pages/Home'),
    title: 'Printing & Documentation Karachi | Mateen Documentation',
    description:
      'Printing, photocopying, documentation, biometric facilitation and customized printing services in North Nazimabad, Karachi.',
    type: 'WebPage',
    breadcrumbs: [homeCrumb],
  },
  '/about': {
    load: () => import('../pages/About'),
    title: 'About Mateen Documentation | North Nazimabad Karachi',
    description:
      'Learn about Mateen Documentation, a printing, documentation, biometric and public facilitation centre in North Nazimabad, Karachi.',
    type: 'AboutPage',
    breadcrumbs: [homeCrumb, { name: 'About', path: '/about' }],
  },
  '/services': {
    load: () => import('../pages/Services'),
    title: 'Printing & Documentation Services | Mateen Documentation',
    description:
      'Explore printing, photocopying, customized products, legal documentation, biometric facilitation and business services in Karachi.',
    type: 'CollectionPage',
    breadcrumbs: [homeCrumb, servicesCrumb],
  },
  '/order-online': {
    load: () => import('../pages/OrderOnline'),
    title: 'Order Printing Online | Mateen Documentation Karachi',
    description:
      'Send your document, assignment, image or design file to Mateen Documentation and submit your printing or service requirements online.',
    type: 'WebPage',
    breadcrumbs: [homeCrumb, { name: 'Order Online', path: '/order-online' }],
  },
  '/contact': {
    load: () => import('../pages/Contact'),
    title: 'Contact Mateen Documentation | North Nazimabad',
    description:
      'Contact Mateen Documentation by phone, WhatsApp or email, or visit our centre near Saifee College in North Nazimabad, Karachi.',
    type: 'ContactPage',
    breadcrumbs: [homeCrumb, { name: 'Contact', path: '/contact' }],
  },
  '/privacy-policy': {
    load: () => import('../pages/PrivacyPolicy'),
    title: 'Privacy Policy | Mateen Documentation',
    description:
      'Read how Mateen Documentation handles personal information, enquiries, online orders and documents uploaded through this website.',
    type: 'WebPage',
    breadcrumbs: [homeCrumb, { name: 'Privacy Policy', path: '/privacy-policy' }],
  },
  '/terms-and-conditions': {
    load: () => import('../pages/TermsConditions'),
    title: 'Terms & Conditions | Mateen Documentation',
    description:
      'Read the terms that apply when using the Mateen Documentation website or submitting printing, documentation and service requests.',
    type: 'WebPage',
    breadcrumbs: [homeCrumb, { name: 'Terms & Conditions', path: '/terms-and-conditions' }],
  },
  '/services/printing-photocopy': {
    load: () => import('../pages/services/PrintingPhotocopy'),
    title: 'Printing & Photocopy Services | Mateen Documentation',
    description:
      'Color and black-and-white printing, photocopying, scanning, photo printing, lamination and document services in North Nazimabad.',
    type: 'Service',
    serviceName: 'Printing & Photocopy',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Printing & Photocopy', path: '/services/printing-photocopy' }],
  },
  '/services/assignment-printing-binding': {
    load: () => import('../pages/services/StudentAssignment'),
    title: 'Assignment Printing & Binding Karachi | Mateen Documentation',
    description:
      'Assignment printing, binding, formatting and academic document printing support for school, college and university students in Karachi.',
    type: 'Service',
    serviceName: 'Assignment Printing & Binding',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Assignment Printing & Binding', path: '/services/assignment-printing-binding' }],
  },
  '/services/customized-printing': {
    load: () => import('../pages/services/CustomizedPrinting'),
    title: 'Customized Printing Services | Mateen Documentation',
    description:
      'Order customized mugs, cards, stickers, labels, photo prints, gifts and event printing from Mateen Documentation in Karachi.',
    type: 'Service',
    serviceName: 'Customized Printing',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Customized Printing', path: '/services/customized-printing' }],
  },
  '/services/cards-photo-frames': {
    load: () => import('../pages/services/CardsPhotoFrames'),
    title: 'PVC Cards & Photo Frames | Mateen Documentation',
    description:
      'Custom photo frames, PVC cards, ID cards, glossy cards, luster cards and personalized card printing in North Nazimabad, Karachi.',
    type: 'Service',
    serviceName: 'PVC Cards & Photo Frames',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'PVC Cards & Photo Frames', path: '/services/cards-photo-frames' }],
  },
  '/services/design-branding': {
    load: () => import('../pages/services/DesignBranding'),
    title: 'Design & Branding Services | Mateen Documentation',
    description:
      'Professional visiting cards, letterheads, brochures, flyers, posters, certificates and promotional design and printing services.',
    type: 'Service',
    serviceName: 'Design & Branding',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Design & Branding', path: '/services/design-branding' }],
  },
  '/services/stationery': {
    load: () => import('../pages/services/Stationery'),
    title: 'Office & School Stationery | Mateen Documentation',
    description:
      'Office, school, business and customized stationery services from Mateen Documentation in H Block, North Nazimabad, Karachi.',
    type: 'Service',
    serviceName: 'Office & School Stationery',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Office & School Stationery', path: '/services/stationery' }],
  },
  '/services/legal-documentation': {
    load: () => import('../pages/services/LegalDocumentation'),
    title: 'Legal Documentation Services | Mateen Documentation',
    description:
      'Assistance preparing affidavits, agreements, rent agreements, power of attorney, will deeds and other legal documents in Karachi.',
    type: 'Service',
    serviceName: 'Legal Documentation',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Legal Documentation', path: '/services/legal-documentation' }],
  },
  '/services/nadra-biometric-public-facilitation': {
    load: () => import('../pages/services/NadraBiometric'),
    title: 'NADRA & Biometric Facilitation | Mateen Documentation',
    description:
      'NADRA e-Sahulat, CNIC, certificate, Nikah Nama, biometric and public application facilitation in North Nazimabad, Karachi.',
    type: 'Service',
    serviceName: 'NADRA / Biometric / Public Facilitation',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'NADRA & Biometric Facilitation', path: '/services/nadra-biometric-public-facilitation' }],
  },
  '/services/vehicle-documentation': {
    load: () => import('../pages/services/VehicleDocumentation'),
    title: 'Vehicle Documentation Services | Mateen Documentation',
    description:
      'Vehicle sale agreements, ownership transfer documents, file-loss documentation and duplicate certificate facilitation in Karachi.',
    type: 'Service',
    serviceName: 'Vehicle Documentation',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Vehicle Documentation', path: '/services/vehicle-documentation' }],
  },
  '/services/business-documentation': {
    load: () => import('../pages/services/BusinessDocumentation'),
    title: 'Business Documentation Services | Mateen Documentation',
    description:
      'Professional company letterheads, experience and salary certificates, business letters, employment documents and business forms.',
    type: 'Service',
    serviceName: 'Business Documentation',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Business Documentation', path: '/services/business-documentation' }],
  },
  '/services/insurance-facilitation': {
    load: () => import('../pages/services/InsuranceFacilitation'),
    title: 'Insurance Facilitation Services | Mateen Documentation',
    description:
      'Third-party motor insurance facilitation, insurance forms and supporting documentation assistance in North Nazimabad, Karachi.',
    type: 'Service',
    serviceName: 'Insurance Facilitation',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Insurance Facilitation', path: '/services/insurance-facilitation' }],
  },
  '/services/bulk-printing': {
    load: () => import('../pages/services/BulkPrinting'),
    title: 'Bulk Printing Services | Mateen Documentation Karachi',
    description:
      'Bulk color and black-and-white printing, photocopying, assignment printing, cards, stickers and labels for larger print runs.',
    type: 'Service',
    serviceName: 'Bulk Printing',
    breadcrumbs: [homeCrumb, servicesCrumb, { name: 'Bulk Printing', path: '/services/bulk-printing' }],
  },
  '/404': {
    load: () => import('../pages/NotFound'),
    title: 'Page Not Found | Mateen Documentation',
    description: 'The requested page could not be found on the Mateen Documentation website.',
    type: 'WebPage',
    index: false,
    breadcrumbs: [homeCrumb, { name: 'Page Not Found', path: '/404' }],
  },
};

export const INDEXABLE_ROUTES = Object.entries(SEO_CONFIG)
  .filter(([, entry]) => entry.index !== false)
  .map(([path]) => path);

export function normalizePath(pathname: string) {
  const cleanPath = pathname.split('?')[0]?.split('#')[0] || '/';
  return cleanPath !== '/' ? cleanPath.replace(/\/+$/, '') : '/';
}

export function absoluteUrl(pathname: string) {
  const path = normalizePath(pathname);
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function getSeoEntry(
  pathname: string,
  fallback?: Pick<SeoEntry, 'title' | 'description'>,
): SeoEntry {
  const path = normalizePath(pathname);
  return SEO_CONFIG[path] ?? {
    ...SEO_CONFIG['/404'],
    title: fallback?.title ?? `Page Not Found | ${SITE_NAME}`,
    description: fallback?.description ?? 'The requested page could not be found.',
  };
}

export function getSeoDocument(
  pathname: string,
  fallback?: Pick<SeoEntry, 'title' | 'description'>,
) {
  const entry = getSeoEntry(pathname, fallback);
  const canonical = absoluteUrl(pathname);
  const robots = entry.index === false ? 'noindex, nofollow' : 'index, follow';

  return {
    entry,
    canonical,
    robots,
    socialImage: DEFAULT_SOCIAL_IMAGE,
    socialImageAlt: SOCIAL_IMAGE_ALT,
    structuredData: buildStructuredData(pathname, entry),
  };
}

export function buildStructuredData(pathname: string, entry = getSeoEntry(pathname)) {
  const path = normalizePath(pathname);
  const url = absoluteUrl(path);
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webpageId = `${url}#webpage`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: SITE_ICON_URL,
      },
      email: 'mateendocumentation@gmail.com',
      telephone: '+92 331 2478337',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad',
        addressLocality: 'Karachi',
        addressCountry: 'PK',
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': organizationId },
      inLanguage: 'en',
    },
    {
      '@type': entry.type === 'Service' ? 'WebPage' : entry.type,
      '@id': webpageId,
      url,
      name: entry.title,
      description: entry.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      ...(entry.breadcrumbs.length > 1
        ? { breadcrumb: { '@id': `${url}#breadcrumb` } }
        : {}),
      inLanguage: 'en',
    },
  ];

  if (entry.breadcrumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: entry.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  if (entry.type === 'Service' && entry.serviceName) {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: entry.serviceName,
      description: entry.description,
      url,
      provider: { '@id': organizationId },
      areaServed: {
        '@type': 'City',
        name: 'Karachi',
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
