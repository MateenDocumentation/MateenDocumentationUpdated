import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// ─── Data types (match DB schema exactly) ──────────────────────────────────

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  logo_url?: string | null;
  favicon_url?: string | null;
}

export interface HeaderSettings {
  id: string;
  phone: string;
  whatsapp: string;
  cta_label: string;
  cta_url: string;
  logo_url?: string | null;
}

export interface FooterLink {
  label: string;
  url: string;
  enabled: boolean;
}

export interface FooterSettings {
  id: string;
  tagline: string;
  description: string;
  trusted_since: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  copyright_text: string;
  developer_credit: string;
  developer_url: string;
  service_links: FooterLink[];
  quick_links: FooterLink[];
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order_index: number;
  is_enabled: boolean;
  has_dropdown: boolean;
  parent_id?: string | null;
}

export interface CmsSeoSetting {
  id: string;
  page_slug: string;
  title: string;
  description: string;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  noindex: boolean;
  nofollow: boolean;
  robots: string;
  sitemap_include: boolean;
  schema_type: string;
  custom_jsonld?: string | null;
}

export interface CmsScript {
  id: string;
  name: string;
  location: 'head_start' | 'head_end' | 'body_start' | 'body_end';
  content: string;
  is_active: boolean;
  priority: number;
}

export interface CmsMetaTag {
  id: string;
  name?: string | null;
  property?: string | null;
  content: string;
  is_active: boolean;
}

export interface CmsCss {
  id: string;
  css: string;
  is_active: boolean;
}

export interface CmsPublishedPage {
  slug: string;
  status: string;
  is_protected: boolean;
}

// ─── Page sections (from page_sections table) ───────────────────────────────

export interface PageSection {
  id: string;
  page_id: string;
  type: string;
  label?: string | null;
  order_index: number;
  is_visible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
}

// ─── Services (from services table) ─────────────────────────────────────────

export interface CmsService {
  id: string;
  title: string;
  tag: string;
  description: string;
  slug: string;
  image_url?: string | null;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
}


export interface CmsMediaAsset {
  id: string;
  public_url: string;
  source_url?: string | null;
  type: 'image' | 'video' | 'svg';
  alt_text?: string | null;
  title?: string | null;
}

export function resolveCmsMedia(mediaAssets: CmsMediaAsset[], sourceUrl: string): string {
  if (!sourceUrl) return sourceUrl;
  return mediaAssets.find(asset => asset.source_url === sourceUrl)?.public_url || sourceUrl;
}

// ─── Full CMS data shape ─────────────────────────────────────────────────────

export interface CmsData {
  siteSettings: SiteSettings | null;
  headerSettings: HeaderSettings | null;
  footerSettings: FooterSettings | null;
  navigationItems: NavigationItem[];
  seoSettings: CmsSeoSetting[];
  customScripts: CmsScript[];
  customMetaTags: CmsMetaTag[];
  customCss: CmsCss | null;
  publishedPages: CmsPublishedPage[];
  /** Page sections keyed by page slug (e.g. "/" or "/about") */
  pageSections: Record<string, PageSection[]>;
  /** All active services from the services table */
  cmsServices: CmsService[];
  /** Public Media Library assets used to resolve imported website media */
  mediaAssets: CmsMediaAsset[];
}

// ─── Safe public snapshot (serialized into HTML, sent to browser) ────────────
// Excludes server-only data (scripts, meta tags, css, seo — already in HTML head)

export interface CmsPublicSnapshot {
  siteSettings: SiteSettings | null;
  headerSettings: HeaderSettings | null;
  footerSettings: FooterSettings | null;
  navigationItems: NavigationItem[];
  pageSections: Record<string, PageSection[]>;
  cmsServices: CmsService[];
  mediaAssets: CmsMediaAsset[];
}

// ─── Context ───────────────────────────────────────────────────────────────

const defaultCmsData: CmsData = {
  siteSettings: null,
  headerSettings: null,
  footerSettings: null,
  navigationItems: [],
  seoSettings: [],
  customScripts: [],
  customMetaTags: [],
  customCss: null,
  publishedPages: [],
  pageSections: {},
  cmsServices: [],
  mediaAssets: [],
};

const CmsContext = createContext<CmsData>(defaultCmsData);

export function CmsDataProvider({ data, children }: { data: CmsData | CmsPublicSnapshot; children: ReactNode }) {
  // Merge snapshot into full CmsData shape (missing fields get defaults)
  const merged: CmsData = {
    ...defaultCmsData,
    ...data,
  };
  return <CmsContext.Provider value={merged}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsData {
  return useContext(CmsContext);
}
