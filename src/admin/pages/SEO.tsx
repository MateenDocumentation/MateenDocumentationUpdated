import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useAuditLog } from '../hooks/useAuditLog';
import { useVersionHistory } from '../hooks/useVersionHistory';
import type { SeoSetting, SchemaType } from '../types';

const SITE_URL = 'https://mateendocumentation.com';

const SCHEMA_TYPES: { value: SchemaType; label: string; desc: string }[] = [
  { value: 'WebPage',        label: 'WebPage',        desc: 'Standard web page — use for most pages' },
  { value: 'AboutPage',      label: 'AboutPage',      desc: 'About / company info page' },
  { value: 'ContactPage',    label: 'ContactPage',    desc: 'Contact form or info page' },
  { value: 'Service',        label: 'Service',        desc: 'Individual service page' },
  { value: 'CollectionPage', label: 'CollectionPage', desc: 'Index / listing page (e.g. all services)' },
  { value: 'FAQPage',        label: 'FAQPage',        desc: 'Page primarily containing FAQ content' },
  { value: 'Article',        label: 'Article',        desc: 'Blog post or editorial article' },
];

// ─── Character counter helpers ─────────────────────────────

function CharCount({ value, min, ideal, max }: { value: string; min: number; ideal: number; max: number }) {
  const len = value.length;
  const color =
    len === 0 ? 'text-gray-300' :
    len < min  ? 'text-amber-500' :
    len > max  ? 'text-red-500' :
    'text-emerald-600';

  const pct = Math.min(len / max, 1);
  const barColor =
    len === 0 ? 'bg-gray-200' :
    len < min  ? 'bg-amber-400' :
    len > max  ? 'bg-red-500' :
    'bg-emerald-500';

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct * 100}%` }} />
      </div>
      <span className={`text-[11px] font-semibold tabular-nums ${color}`}>{len}/{max}</span>
      {len < min && len > 0 && <span className="text-[10px] text-amber-500">Too short</span>}
      {len > max && <span className="text-[10px] text-red-500">Too long</span>}
      {len >= min && len <= ideal && len > 0 && <span className="text-[10px] text-emerald-600">Good</span>}
    </div>
  );
}

// ─── SERP preview ─────────────────────────────────────────

function SerpPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const displayUrl = SITE_URL + slug;
  const cleanTitle = title || 'Page Title';
  const cleanDesc = description || 'Meta description will appear here...';

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 font-sans">
      <p className="text-[12px] text-gray-400 mb-1">Google Search Preview</p>
      <div className="max-w-xl">
        <p className="text-xs text-gray-500 truncate mb-0.5">{displayUrl}</p>
        <p className={`text-[18px] leading-snug truncate mb-1 ${title.length > 60 ? 'text-red-600' : 'text-blue-700'}`}
          style={{ fontFamily: 'Arial, sans-serif' }}>
          {cleanTitle.length > 60 ? cleanTitle.slice(0, 60) + '…' : cleanTitle}
        </p>
        <p className="text-[13px] leading-relaxed text-gray-600 line-clamp-2"
          style={{ fontFamily: 'Arial, sans-serif' }}>
          {cleanDesc.length > 160 ? cleanDesc.slice(0, 160) + '…' : cleanDesc}
        </p>
      </div>
    </div>
  );
}

// ─── Social card preview ──────────────────────────────────

function SocialPreview({ title, description, image }: { title: string; description: string; image?: string }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden max-w-sm">
      <div className="aspect-[1200/630] bg-gray-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-300 text-xs">No OG image set</span>
        )}
      </div>
      <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">mateendocumentation.com</p>
        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{title || 'OG Title'}</p>
        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{description || 'OG description...'}</p>
      </div>
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────

export default function SEOManager() {
  const toast = useToast();
  const { role } = useAuth();
  const auditLog = useAuditLog();
  const recordVersion = useVersionHistory();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [settings, setSettings] = useState<SeoSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SeoSetting | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'basic' | 'social' | 'schema' | 'advanced'>('basic');
  const [jsonldError, setJsonldError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('seo_settings').select('*').order('page_slug').then(({ data }) => {
      setSettings((data ?? []).map(normalise));
      setLoading(false);
    });
  }, []);

  function normalise(raw: Record<string, unknown>): SeoSetting {
    return {
      id: String(raw.id ?? ''),
      page_slug: String(raw.page_slug ?? ''),
      title: String(raw.title ?? ''),
      description: String(raw.description ?? ''),
      canonical_url: raw.canonical_url ? String(raw.canonical_url) : undefined,
      og_title: raw.og_title ? String(raw.og_title) : undefined,
      og_description: raw.og_description ? String(raw.og_description) : undefined,
      og_image: raw.og_image ? String(raw.og_image) : undefined,
      twitter_title: raw.twitter_title ? String(raw.twitter_title) : undefined,
      twitter_description: raw.twitter_description ? String(raw.twitter_description) : undefined,
      twitter_image: raw.twitter_image ? String(raw.twitter_image) : undefined,
      noindex: Boolean(raw.noindex),
      nofollow: Boolean(raw.nofollow),
      robots: String(raw.robots ?? 'index,follow'),
      sitemap_include: raw.sitemap_include !== false,
      schema_type: (raw.schema_type as SchemaType) ?? 'WebPage',
      custom_jsonld: raw.custom_jsonld ? String(raw.custom_jsonld) : undefined,
      updated_at: String(raw.updated_at ?? ''),
    };
  }

  function openEdit(setting: SeoSetting) {
    setEditing({ ...setting });
    setTab('basic');
    setJsonldError('');
  }

  function set<K extends keyof SeoSetting>(key: K, value: SeoSetting[K]) {
    setEditing(prev => prev ? { ...prev, [key]: value } : null);
  }

  function validateJsonld(value: string): boolean {
    if (!value.trim()) { setJsonldError(''); return true; }
    try {
      const parsed = JSON.parse(value);
      if (!parsed['@context'] || !parsed['@type']) {
        setJsonldError('Must contain @context and @type properties.');
        return false;
      }
      setJsonldError('');
      return true;
    } catch {
      setJsonldError('Invalid JSON. Fix syntax errors before saving.');
      return false;
    }
  }

  async function saveSetting() {
    if (!editing) return;
    if (editing.custom_jsonld && !validateJsonld(editing.custom_jsonld)) return;

    setSaving(true);

    const computed_robots = [
      editing.noindex ? 'noindex' : 'index',
      editing.nofollow ? 'nofollow' : 'follow',
    ].join(',');

    const payload = {
      ...editing,
      robots: computed_robots,
      sitemap_include: !editing.noindex && editing.sitemap_include,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('seo_settings').update(payload).eq('id', editing.id);
    setSaving(false);

    if (error) { toast('Save failed: ' + error.message, 'error'); return; }
    const prev = settings.find(s => s.id === editing.id);
    if (prev) {
      await recordVersion('seo_settings', editing.id, prev as unknown as Record<string, unknown>, payload as Record<string, unknown>);
    }
    await auditLog('seo_save', 'seo_settings', editing.id, { slug: editing.page_slug });
    setSettings(prev => prev.map(s => s.id === editing.id ? normalise(payload as Record<string, unknown>) : s));
    setEditing(null);
    toast('SEO settings saved');
  }

  const robotsBadge = (s: SeoSetting) => {
    if (s.noindex) return 'bg-red-50 text-red-700';
    return 'bg-emerald-50 text-emerald-700';
  };

  const filtered = settings.filter(s =>
    !search || s.page_slug.toLowerCase().includes(search.toLowerCase()) || s.title.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'basic',    label: 'Basic SEO' },
    { key: 'social',   label: 'Social' },
    { key: 'schema',   label: 'Schema' },
    { key: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Rank Math-level per-page SEO — titles, meta, Open Graph, Twitter Cards, schema &amp; robots
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pages…"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
        />
      </div>

      {/* Page table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5 w-56">Page</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">SEO Title</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-24">Robots</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-24">Sitemap</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-24">Schema</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5 w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" /></td></tr>
                ))
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-3.5">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{s.page_slug}</code>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {/* Traffic light */}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        s.title.length === 0 ? 'bg-gray-300' :
                        s.title.length < 30 ? 'bg-amber-400' :
                        s.title.length <= 60 ? 'bg-emerald-500' :
                        'bg-red-500'
                      }`} />
                      <p className="text-sm text-gray-800 truncate max-w-xs">{s.title || <span className="text-gray-300 italic">No title set</span>}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${robotsBadge(s)}`}>
                      {s.noindex ? 'NOINDEX' : 'INDEX'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.sitemap_include && !s.noindex ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.sitemap_include && !s.noindex ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{s.schema_type}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => openEdit(s)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#071A2B] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit modal ─────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[95vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900">SEO Editor</h2>
                <code className="text-xs text-gray-400">{editing.page_slug}</code>
              </div>
              <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 border-b border-gray-100 flex-shrink-0">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${
                    tab === t.key
                      ? 'text-[#071A2B] border-[#071A2B]'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* ── BASIC SEO ─────────────────────────── */}
              {tab === 'basic' && (
                <div className="space-y-5">
                  <SerpPreview
                    title={editing.title}
                    description={editing.description}
                    slug={editing.page_slug}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-600">SEO Title</label>
                      <span className="text-[10px] text-gray-400">Recommended: 30–60 chars</span>
                    </div>
                    <input
                      type="text"
                      value={editing.title}
                      onChange={e => set('title', e.target.value)}
                      placeholder="Page Title | Site Name"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
                    />
                    <CharCount value={editing.title} min={30} ideal={55} max={60} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-600">Meta Description</label>
                      <span className="text-[10px] text-gray-400">Recommended: 120–160 chars</span>
                    </div>
                    <textarea
                      value={editing.description}
                      onChange={e => set('description', e.target.value)}
                      rows={3}
                      placeholder="Compelling description that appears in search results…"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] resize-none"
                    />
                    <CharCount value={editing.description} min={120} ideal={150} max={160} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Canonical URL <span className="text-gray-400 font-normal">(leave blank to use page URL)</span></label>
                    <input
                      type="url"
                      value={editing.canonical_url ?? ''}
                      onChange={e => set('canonical_url', e.target.value || undefined)}
                      placeholder="https://mateendocumentation.com/page"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Robots Directives</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Toggle
                        checked={editing.noindex}
                        onChange={v => set('noindex', v)}
                        label="noindex (hide from Google)"
                      />
                      <Toggle
                        checked={editing.nofollow}
                        onChange={v => set('nofollow', v)}
                        label="nofollow (no link equity)"
                      />
                    </div>
                    <Toggle
                      checked={editing.sitemap_include}
                      onChange={v => set('sitemap_include', v)}
                      label="Include in sitemap.xml"
                    />
                    {editing.noindex && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p className="text-xs text-red-700 font-medium">noindex automatically removes this page from the sitemap.</p>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-400">
                      Computed: <code className="bg-gray-100 px-1 rounded">
                        {(editing.noindex ? 'noindex' : 'index') + ',' + (editing.nofollow ? 'nofollow' : 'follow')}
                      </code>
                    </p>
                  </div>
                </div>
              )}

              {/* ── SOCIAL ────────────────────────────── */}
              {tab === 'social' && (
                <div className="space-y-5">
                  <SocialPreview
                    title={editing.og_title || editing.title}
                    description={editing.og_description || editing.description}
                    image={editing.og_image}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Open Graph (Facebook / LinkedIn)</p>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">OG Title <span className="text-gray-400">(defaults to SEO title)</span></label>
                        <input type="text" value={editing.og_title ?? ''}
                          onChange={e => set('og_title', e.target.value || undefined)}
                          placeholder={editing.title || 'OG Title…'}
                          className={inputCls} />
                        <CharCount value={editing.og_title ?? ''} min={20} ideal={60} max={90} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">OG Description <span className="text-gray-400">(defaults to meta description)</span></label>
                        <textarea value={editing.og_description ?? ''}
                          onChange={e => set('og_description', e.target.value || undefined)}
                          rows={3} placeholder={editing.description || 'OG Description…'}
                          className={textareaCls} />
                        <CharCount value={editing.og_description ?? ''} min={60} ideal={150} max={200} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">OG Image URL <span className="text-gray-400">Recommended: 1200×630px</span></label>
                        <input type="url" value={editing.og_image ?? ''}
                          onChange={e => set('og_image', e.target.value || undefined)}
                          placeholder="https://…/og-image.jpg"
                          className={inputCls} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Twitter / X Card</p>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Twitter Title <span className="text-gray-400">(defaults to OG title)</span></label>
                        <input type="text" value={editing.twitter_title ?? ''}
                          onChange={e => set('twitter_title', e.target.value || undefined)}
                          placeholder={editing.og_title || editing.title || 'Twitter Title…'}
                          className={inputCls} />
                        <CharCount value={editing.twitter_title ?? ''} min={20} ideal={60} max={70} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Twitter Description</label>
                        <textarea value={editing.twitter_description ?? ''}
                          onChange={e => set('twitter_description', e.target.value || undefined)}
                          rows={3} placeholder={editing.og_description || editing.description || 'Twitter Description…'}
                          className={textareaCls} />
                        <CharCount value={editing.twitter_description ?? ''} min={60} ideal={130} max={200} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Twitter Image URL <span className="text-gray-400">(defaults to OG image)</span></label>
                        <input type="url" value={editing.twitter_image ?? ''}
                          onChange={e => set('twitter_image', e.target.value || undefined)}
                          placeholder={editing.og_image || 'https://…/twitter-image.jpg'}
                          className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SCHEMA ────────────────────────────── */}
              {tab === 'schema' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Schema Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SCHEMA_TYPES.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => set('schema_type', t.value)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            editing.schema_type === t.value
                              ? 'border-[#071A2B] bg-[#EEF7FF]'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            editing.schema_type === t.value ? 'border-[#071A2B]' : 'border-gray-300'
                          }`}>
                            {editing.schema_type === t.value && <div className="w-2 h-2 rounded-full bg-[#071A2B]" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs text-blue-800">
                      The existing JSON-LD schema architecture from <code>src/seo/config.ts</code> is preserved.
                      Schema type selected here is stored for Phase 4 build-time integration.
                    </p>
                  </div>

                  {/* Custom JSON-LD — SUPER_ADMIN only */}
                  {isSuperAdmin ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-gray-600">Custom JSON-LD <span className="text-[10px] font-normal text-gray-400 ml-1">SUPER_ADMIN</span></label>
                        <button
                          type="button"
                          onClick={() => {
                            if (editing.custom_jsonld) validateJsonld(editing.custom_jsonld);
                          }}
                          className="text-[11px] font-semibold text-[#00AEEF] hover:underline"
                        >
                          Validate JSON
                        </button>
                      </div>
                      <textarea
                        value={editing.custom_jsonld ?? ''}
                        onChange={e => {
                          set('custom_jsonld', e.target.value || undefined);
                          if (jsonldError) validateJsonld(e.target.value);
                        }}
                        onBlur={e => validateJsonld(e.target.value)}
                        rows={10}
                        placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Mateen Documentation"\n}'}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 resize-none ${
                          jsonldError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#071A2B]'
                        }`}
                      />
                      {jsonldError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          {jsonldError}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">
                        Must be valid JSON-LD with <code>@context</code> and <code>@type</code>. Output only for visible page content.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500">Custom JSON-LD is available to SUPER_ADMIN only.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── ADVANCED ──────────────────────────── */}
              {tab === 'advanced' && (
                <div className="space-y-5">
                  {isSuperAdmin ? (
                    <>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-xs text-amber-800 font-semibold">Advanced settings are SUPER_ADMIN only. Incorrect values can harm search rankings.</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                        <p className="text-xs font-bold text-gray-700 mb-3">Computed robots directive</p>
                        <code className="text-sm text-[#071A2B] bg-white border border-gray-200 px-3 py-2 rounded-lg block">
                          {(editing.noindex ? 'noindex' : 'index') + ',' + (editing.nofollow ? 'nofollow' : 'follow')}
                        </code>
                        <p className="text-[11px] text-gray-400 mt-2">Set via the Index/Noindex toggles on the Basic tab.</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-1">Sitemap Inclusion</p>
                        <p className="text-[11px] text-gray-500 mb-3">
                          Pages are excluded from sitemap if: noindex is on, status is draft, or sitemap_include is off.
                        </p>
                        <Toggle
                          checked={editing.sitemap_include}
                          onChange={v => set('sitemap_include', v)}
                          label="Include in sitemap.xml"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-400">Advanced settings are available to SUPER_ADMIN only.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <p className="text-[11px] text-gray-400">
                Last saved: {editing.updated_at ? new Date(editing.updated_at).toLocaleString('en-PK') : 'Never'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSetting}
                  disabled={saving || !!jsonldError}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save SEO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors';
const textareaCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] resize-none transition-colors';
