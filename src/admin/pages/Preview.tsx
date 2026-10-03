import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Page, PageSection } from '../types';

/**
 * Authenticated draft preview — shows raw CMS section content for a page.
 * This route is admin-only, noindex, nofollow, and never appears in the sitemap.
 * It renders the sections as structured data so editors can review content
 * before publishing.
 */
export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inject noindex into <head> while this component is mounted
  const metaRef = useRef<HTMLMetaElement | null>(null);
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    metaRef.current = meta;
    return () => {
      if (metaRef.current) document.head.removeChild(metaRef.current);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('pages').select('*').eq('id', id).single(),
      supabase.from('page_sections').select('*').eq('page_id', id).order('order_index'),
    ]).then(([pageRes, sectionsRes]) => {
      if (pageRes.error || !pageRes.data) {
        setError('Page not found.');
      } else {
        setPage(pageRes.data as Page);
        setSections((sectionsRes.data ?? []) as PageSection[]);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#071A2B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">{error || 'Page not found.'}</p>
        <Link to="/admin/pages" className="text-sm text-[#00AEEF] hover:underline mt-3 block">← Back to pages</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Draft banner */}
      <div className="bg-amber-400 text-amber-900 text-center py-2.5 px-4 text-sm font-bold tracking-wide sticky top-0 z-50 shadow">
        ⚠ DRAFT PREVIEW — Not indexed · Not visible to the public ·{' '}
        <span className="font-normal">{page.name}</span>
        <Link
          to="/admin/pages"
          className="ml-4 underline text-amber-900 hover:text-amber-700"
        >
          ← Back to Pages
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Page meta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{page.name}</h1>
              <code className="text-sm text-gray-400">{page.slug}</code>
            </div>
            <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full border ${
              page.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              page.status === 'unpublished' ? 'bg-gray-100 text-gray-500 border-gray-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {page.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
            <div>Last edited: <strong className="text-gray-600">{new Date(page.last_edited_at ?? page.updated_at).toLocaleString('en-PK')}</strong></div>
            <div>Sections: <strong className="text-gray-600">{sections.length}</strong></div>
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            No sections added yet.
          </div>
        ) : (
          sections.map((section, idx) => (
            <SectionPreview key={section.id} section={section} index={idx + 1} />
          ))
        )}

        {/* Publish prompt */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Looks good? Go to Pages to publish and trigger a Vercel build.
          </p>
          <Link
            to="/admin/pages"
            className="inline-block px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Go to Pages → Publish
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Section preview card ─────────────────────────────────────────────────────

function SectionPreview({ section, index }: { section: PageSection; index: number }) {
  const c = section.content as Record<string, unknown>;
  const visible = section.is_visible;

  return (
    <div className={`bg-white rounded-2xl border ${visible ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-50'} overflow-hidden`}>
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">{index}</span>
        <span className="text-xs font-bold text-gray-700 capitalize">{section.type.replace(/_/g, ' ')}</span>
        {section.label && <span className="text-xs text-gray-400">— {section.label}</span>}
        {!visible && <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Hidden</span>}
      </div>

      {/* Content preview */}
      <div className="p-5">
        {section.type === 'hero' && <HeroPreview c={c} />}
        {section.type === 'heading' && <HeadingPreview c={c} />}
        {section.type === 'text' && <TextPreview c={c} />}
        {section.type === 'cta' && <CtaPreview c={c} />}
        {(section.type === 'image' || section.type === 'video') && <MediaPreview c={c} type={section.type} />}
        {(section.type === 'cards' || section.type === 'features') && <ListPreview c={c} />}
        {section.type === 'faq' && <FaqPreview c={c} />}
        {!['hero','heading','text','cta','image','video','cards','features','faq'].includes(section.type) && (
          <RawJsonPreview c={c} />
        )}
      </div>
    </div>
  );
}

function str(v: unknown): string { return typeof v === 'string' ? v : ''; }
function arr(v: unknown): unknown[] { return Array.isArray(v) ? v : []; }

function HeroPreview({ c }: { c: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      {str(c.badge) && <span className="text-[11px] font-bold bg-[#EEF7FF] text-[#00AEEF] px-3 py-1 rounded-full">{str(c.badge)}</span>}
      {str(c.heading) && <h2 className="text-2xl font-bold text-gray-900">{str(c.heading)}</h2>}
      {str(c.subheading) && <p className="text-lg text-gray-600">{str(c.subheading)}</p>}
      {str(c.description) && <p className="text-sm text-gray-500 max-w-xl">{str(c.description)}</p>}
      <div className="flex gap-2 flex-wrap">
        {str(c.cta_primary_text) && <span className="px-4 py-2 text-sm font-bold bg-[#071A2B] text-white rounded-xl">{str(c.cta_primary_text)}</span>}
        {str(c.cta_secondary_text) && <span className="px-4 py-2 text-sm font-bold border border-gray-200 text-gray-700 rounded-xl">{str(c.cta_secondary_text)}</span>}
      </div>
      {str(c.image) && <img src={str(c.image)} alt={str(c.alt_text) || 'Hero image'} className="w-full max-h-48 object-cover rounded-xl mt-2" />}
    </div>
  );
}

function HeadingPreview({ c }: { c: Record<string, unknown> }) {
  const level = Math.min(Math.max((c.level as number) || 2, 1), 6);
  const sizeMap: Record<number, string> = { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-xl', 4: 'text-lg', 5: 'text-base', 6: 'text-sm' };
  const cls = `${sizeMap[level] ?? 'text-xl'} font-bold text-gray-900`;
  const text = str(c.text);
  if (level === 1) return <h1 className={cls}>{text}</h1>;
  if (level === 2) return <h2 className={cls}>{text}</h2>;
  if (level === 3) return <h3 className={cls}>{text}</h3>;
  if (level === 4) return <h4 className={cls}>{text}</h4>;
  if (level === 5) return <h5 className={cls}>{text}</h5>;
  return <h6 className={cls}>{text}</h6>;
}

function TextPreview({ c }: { c: Record<string, unknown> }) {
  return <p className="text-sm text-gray-700 whitespace-pre-wrap">{str(c.content) || str(c.text)}</p>;
}

function CtaPreview({ c }: { c: Record<string, unknown> }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {str(c.heading) && <p className="text-base font-semibold text-gray-800">{str(c.heading)}</p>}
      {str(c.primary_text) && <span className="px-4 py-2 text-sm font-bold bg-[#071A2B] text-white rounded-xl">{str(c.primary_text)}</span>}
      {str(c.secondary_text) && <span className="px-4 py-2 text-sm font-bold border border-gray-200 rounded-xl">{str(c.secondary_text)}</span>}
    </div>
  );
}

function MediaPreview({ c, type }: { c: Record<string, unknown>; type: string }) {
  const url = str(c.url) || str(c.src) || str(c.image);
  if (!url) return <p className="text-xs text-gray-400 italic">No {type} URL set.</p>;
  if (type === 'image') return <img src={url} alt={str(c.alt_text)} className="max-h-48 object-cover rounded-xl" />;
  return <video src={url} controls className="max-h-48 rounded-xl w-full" />;
}

function ListPreview({ c }: { c: Record<string, unknown> }) {
  const items = arr(c.items ?? c.cards ?? c.features);
  if (!items.length) return <p className="text-xs text-gray-400 italic">No items.</p>;
  return (
    <ul className="space-y-2">
      {items.slice(0, 6).map((item, i) => {
        const it = item as Record<string, unknown>;
        return (
          <li key={i} className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#EEF7FF] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{str(it.title ?? it.heading)}</p>
              {str(it.description) && <p className="text-xs text-gray-500 mt-0.5">{str(it.description)}</p>}
            </div>
          </li>
        );
      })}
      {items.length > 6 && <li className="text-xs text-gray-400">+{items.length - 6} more…</li>}
    </ul>
  );
}

function FaqPreview({ c }: { c: Record<string, unknown> }) {
  const items = arr(c.items ?? c.faqs);
  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item, i) => {
        const it = item as Record<string, unknown>;
        return (
          <div key={i} className="border border-gray-100 rounded-xl p-3">
            <p className="text-sm font-semibold text-gray-800">{str(it.question)}</p>
            <p className="text-xs text-gray-500 mt-1">{str(it.answer)}</p>
          </div>
        );
      })}
    </div>
  );
}

function RawJsonPreview({ c }: { c: Record<string, unknown> }) {
  return (
    <pre className="text-[10px] text-gray-500 bg-gray-50 rounded-xl p-3 overflow-auto max-h-48 font-mono whitespace-pre-wrap">
      {JSON.stringify(c, null, 2)}
    </pre>
  );
}
