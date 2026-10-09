// ─── Database Types ────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'EDITOR';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  logo_url?: string;
  favicon_url?: string;
  updated_at: string;
}

export interface HeaderSettings {
  id: string;
  phone: string;
  whatsapp: string;
  cta_label: string;
  cta_url: string;
  logo_url?: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order_index: number;
  is_enabled: boolean;
  has_dropdown: boolean;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FooterServiceLink {
  label: string;
  url: string;
  enabled: boolean;
}

export interface FooterQuickLink {
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
  service_links: FooterServiceLink[];
  quick_links: FooterQuickLink[];
  updated_at: string;
}

export type PageStatus = 'published' | 'draft' | 'unpublished';

export interface Page {
  id: string;
  name: string;
  slug: string;
  status: PageStatus;
  is_protected: boolean;
  published_at?: string;
  published_by?: string;
  last_edited_at?: string;
  last_edited_by?: string;
  updated_at: string;
  created_at: string;
}

export type DeployStatus = 'idle' | 'publishing' | 'published' | 'failed';

export interface DeploymentLog {
  id: string;
  triggered_by?: string;
  triggered_at: string;
  status: 'pending' | 'triggered' | 'failed';
  page_id?: string;
  page_slug?: string;
  action: string;
  error_message?: string;
  deploy_id?: string;
}

export interface PublishResult {
  success: boolean;
  new_status: PageStatus;
  deploy: 'triggered' | 'skipped' | 'failed';
  message: string;
  deploy_id?: string;
}

export type SectionType =
  | 'hero'
  | 'service_strip'
  | 'printing_feature'
  | 'academic_feature'
  | 'how_it_works'
  | 'customized_printing'
  | 'who_we_serve'
  | 'final_cta'
  | 'heading'
  | 'text'
  | 'image'
  | 'video'
  | 'image_text'
  | 'cta'
  | 'cards'
  | 'services_grid'
  | 'features'
  | 'gallery'
  | 'faq'
  | 'contact'
  | 'who_we_are'
  | 'audiences'
  | 'principles'
  | 'location'
  | 'contact_info'
  | 'services_list'
  | 'how_steps'
  | 'related'
  | 'rich_text'
  | 'services_page'
  | 'why_us'
  | 'help_cta'
  | 'form_config'
  | 'shared_labels'
  | 'group_list'
  | 'services_showcase';

export interface PageSection {
  id: string;
  page_id: string;
  type: SectionType;
  label?: string;
  order_index: number;
  is_visible: boolean;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  source_url?: string | null;
  type: 'image' | 'video' | 'svg';
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  title?: string;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  tag: string;
  description: string;
  slug: string;
  image_url?: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SchemaType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'Service'
  | 'CollectionPage'
  | 'FAQPage'
  | 'Article';

export interface SeoSetting {
  id: string;
  page_slug: string;
  title: string;
  description: string;
  canonical_url?: string;
  focus_keyword?: string;
  image_alt_text?: string;
  breadcrumb_label?: string;
  // Social
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  // Robots
  noindex: boolean;
  nofollow: boolean;
  robots: string;
  // Sitemap
  sitemap_include: boolean;
  // Schema
  schema_type: SchemaType;
  custom_jsonld?: string;
  updated_at: string;
}

export interface CustomMetaTag {
  id: string;
  name?: string;
  property?: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomCss {
  id: string;
  css: string;
  is_active: boolean;
  updated_at: string;
}

export interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  description?: string;
  status_code: 301 | 302 | 308;
  is_active: boolean;
  created_at: string;
}

export type ScriptLocation = 'head_start' | 'head_end' | 'body_start' | 'body_end';

export interface CustomScript {
  id: string;
  name: string;
  description?: string;
  location: ScriptLocation;
  content: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  table_name: string;
  record_id: string;
  snapshot: Record<string, unknown>;       // state BEFORE the change
  new_snapshot?: Record<string, unknown>;  // state AFTER the change
  changed_by: string;
  action: string;
  rollback_of?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  table_name?: string;
  record_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// ─── Supabase Database schema placeholder ─────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      site_settings: { Row: SiteSettings; Insert: Partial<SiteSettings>; Update: Partial<SiteSettings> };
      header_settings: { Row: HeaderSettings; Insert: Partial<HeaderSettings>; Update: Partial<HeaderSettings> };
      navigation_items: { Row: NavigationItem; Insert: Partial<NavigationItem>; Update: Partial<NavigationItem> };
      footer_settings: { Row: FooterSettings; Insert: Partial<FooterSettings>; Update: Partial<FooterSettings> };
      pages: { Row: Page; Insert: Partial<Page>; Update: Partial<Page> };
      page_sections: { Row: PageSection; Insert: Partial<PageSection>; Update: Partial<PageSection> };
      media_assets: { Row: MediaAsset; Insert: Partial<MediaAsset>; Update: Partial<MediaAsset> };
      services: { Row: Service; Insert: Partial<Service>; Update: Partial<Service> };
      seo_settings: { Row: SeoSetting; Insert: Partial<SeoSetting>; Update: Partial<SeoSetting> };
      redirects: { Row: Redirect; Insert: Partial<Redirect>; Update: Partial<Redirect> };
      custom_scripts: { Row: CustomScript; Insert: Partial<CustomScript>; Update: Partial<CustomScript> };
      content_versions: { Row: ContentVersion; Insert: Partial<ContentVersion>; Update: Partial<ContentVersion> };
      audit_logs: { Row: AuditLog; Insert: Partial<AuditLog>; Update: Partial<AuditLog> };
    };
  };
};
