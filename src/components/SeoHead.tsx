import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getSeoDocument,
  SITE_ICON,
} from '../seo/config';

interface SeoHeadProps {
  fallbackTitle?: string;
  fallbackDescription?: string;
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export default function SeoHead({ fallbackTitle, fallbackDescription }: SeoHeadProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const { entry, canonical, robots, socialImage, socialImageAlt, structuredData } =
      getSeoDocument(pathname, {
        title: fallbackTitle ?? '',
        description: fallbackDescription ?? '',
      });

    document.title = entry.title;
    document.documentElement.lang = 'en';
    setMeta('name', 'description', entry.description);
    setMeta('name', 'robots', robots);
    setMeta('name', 'googlebot', robots);
    setLink('canonical', canonical);
    setLink('apple-touch-icon', SITE_ICON);

    setMeta('property', 'og:title', entry.title);
    setMeta('property', 'og:description', entry.description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', socialImage);
    setMeta('property', 'og:image:alt', socialImageAlt);
    setMeta('property', 'og:site_name', 'Mateen Documentation');
    setMeta('property', 'og:locale', 'en_PK');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', entry.title);
    setMeta('name', 'twitter:description', entry.description);
    setMeta('name', 'twitter:image', socialImage);
    setMeta('name', 'twitter:image:alt', socialImageAlt);

    let script = document.head.querySelector<HTMLScriptElement>('#seo-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [fallbackDescription, fallbackTitle, pathname]);

  return null;
}
