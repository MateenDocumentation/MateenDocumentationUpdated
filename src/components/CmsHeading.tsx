import type { CSSProperties, ReactNode } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type VisualSize = 'default' | 'small' | 'medium' | 'large' | 'xl';

type SectionLike = { content?: Record<string, unknown> } | null | undefined;

const SIZE_MAP: Record<Exclude<VisualSize, 'default'>, string> = {
  small: 'clamp(1.5rem, 2.2vw, 2rem)',
  medium: 'clamp(2rem, 3vw, 2.8rem)',
  large: 'clamp(2.5rem, 4vw, 3.8rem)',
  xl: 'clamp(3rem, 5vw, 5rem)',
};

export function getHeadingTag(section: SectionLike, fallback: HeadingTag = 'h2'): HeadingTag {
  const value = String(section?.content?.heading_tag ?? '').toLowerCase();
  return /^h[1-6]$/.test(value) ? (value as HeadingTag) : fallback;
}

export function getHeadingStyle(section: SectionLike, base?: CSSProperties): CSSProperties {
  const visual = String(section?.content?.heading_visual_size ?? 'default') as VisualSize;
  const rawPx = section?.content?.heading_font_size_px;
  const px = typeof rawPx === 'number' ? rawPx : Number(String(rawPx ?? '').replace(/px$/i, '').trim());
  const style: CSSProperties = { ...(base ?? {}) };
  if (Number.isFinite(px) && px > 0) style.fontSize = `${px}px`;
  else if (visual !== 'default' && SIZE_MAP[visual]) style.fontSize = SIZE_MAP[visual];
  return style;
}

export default function CmsHeading({
  section,
  fallbackTag = 'h2',
  className,
  style,
  children,
}: {
  section?: SectionLike;
  fallbackTag?: HeadingTag;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag = getHeadingTag(section, fallbackTag);
  return <Tag className={className} style={getHeadingStyle(section, style)}>{children}</Tag>;
}
