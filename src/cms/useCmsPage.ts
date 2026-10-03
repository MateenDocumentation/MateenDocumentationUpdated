import { useCms } from './CmsContext';
import type { PageSection } from './CmsContext';

/**
 * Returns all visible, ordered page sections for a given slug.
 * Falls back to empty array when no CMS data exists for that page.
 */
export function useCmsPageSections(slug: string): PageSection[] {
  const { pageSections } = useCms();
  const normalizedSlug = slug === '/' ? '/' : slug.replace(/\/+$/, '');
  const sections = pageSections[normalizedSlug] ?? [];
  return sections
    .filter(s => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);
}

/**
 * Returns the first section of a given type for a page slug.
 * Returns null if no matching section exists.
 */
export function useCmsSection(slug: string, type: string, index = 0): PageSection | null {
  const sections = useCmsPageSections(slug);
  const matching = sections.filter(s => s.type === type);
  return matching[index] ?? null;
}

/**
 * Helper to safely extract a string field from section content.
 */
export function str(section: PageSection | null, key: string, fallback = ''): string {
  if (!section) return fallback;
  const val = section.content[key];
  return typeof val === 'string' && val.trim() ? val : fallback;
}

/**
 * Helper to safely extract an array field from section content.
 */
export function arr<T = unknown>(section: PageSection | null, key: string): T[] {
  if (!section) return [];
  const val = section.content[key];
  return Array.isArray(val) ? (val as T[]) : [];
}
