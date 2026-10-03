import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { CustomMetaTag } from '../types';

// Meta names/properties that are already output by standard SEO pipeline
const RESERVED = new Set([
  'title', 'description', 'robots', 'viewport', 'charset',
  'og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name',
  'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
  'canonical',
]);

const emptyForm = { name: '', property: '', content: '', is_active: true };
type FormState = typeof emptyForm;

export default function MetaTags() {
  const toast = useToast();
  const [tags, setTags] = useState<CustomMetaTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'add' | CustomMetaTag>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('custom_meta_tags').select('*').order('created_at').then(({ data }) => {
      setTags((data ?? []) as CustomMetaTag[]);
      setLoading(false);
    });
  }, []);

  function f<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function reservedWarning(): string | null {
    const key = form.name.toLowerCase() || form.property.toLowerCase();
    if (RESERVED.has(key)) {
      return `"${key}" is already output by the standard SEO pipeline. Duplicating it may cause conflicts.`;
    }
    return null;
  }

  function openAdd() {
    setForm({ ...emptyForm });
    setModal('add');
  }

  function openEdit(t: CustomMetaTag) {
    setForm({
      name: t.name ?? '',
      property: t.property ?? '',
      content: t.content,
      is_active: t.is_active,
    });
    setModal(t);
  }

  async function save() {
    if (!form.name.trim() && !form.property.trim()) {
      toast('Either name or property is required', 'error');
      return;
    }
    if (!form.content.trim()) {
      toast('Content is required', 'error');
      return;
    }

    const payload: Partial<CustomMetaTag> = {
      name: form.name || undefined,
      property: form.property || undefined,
      content: form.content,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    if (modal === 'add') {
      const { data, error } = await supabase.from('custom_meta_tags').insert(payload).select().single();
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setTags(prev => [...prev, data as CustomMetaTag]);
    } else {
      const t = modal as CustomMetaTag;
      const { error } = await supabase.from('custom_meta_tags').update(payload).eq('id', t.id);
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setTags(prev => prev.map(x => x.id === t.id ? { ...x, ...payload } : x));
    }

    setSaving(false);
    setModal(null);
    toast(modal === 'add' ? 'Meta tag added' : 'Meta tag saved');
  }

  async function toggleActive(t: CustomMetaTag) {
    const is_active = !t.is_active;
    const { error } = await supabase.from('custom_meta_tags').update({ is_active }).eq('id', t.id);
    if (error) { toast('Failed', 'error'); return; }
    setTags(prev => prev.map(x => x.id === t.id ? { ...x, is_active } : x));
  }

  async function del(t: CustomMetaTag) {
    if (!confirm(`Delete this meta tag?`)) return;
    const { error } = await supabase.from('custom_meta_tags').delete().eq('id', t.id);
    if (error) { toast('Delete failed', 'error'); return; }
    setTags(prev => prev.filter(x => x.id !== t.id));
    toast('Meta tag deleted');
  }

  const warning = modal !== null ? reservedWarning() : null;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meta Tag Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Custom <code className="text-xs bg-gray-100 px-1 rounded">&lt;meta&gt;</code> tags injected globally — verification codes, custom directives, theme color</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] transition-colors">
          + Add Meta Tag
        </button>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xs text-blue-800">Standard tags (title, description, robots, og:*, twitter:*) are already managed in SEO Settings. Use this for additional tags like Google Search Console verification, theme-color, or custom directives.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">Name / Property</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Content</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-20">Active</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5 w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : tags.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">No custom meta tags yet.</td>
              </tr>
            ) : tags.map(t => (
              <tr key={t.id} className={`hover:bg-gray-50/40 transition-colors ${!t.is_active ? 'opacity-50' : ''}`}>
                <td className="px-6 py-3.5">
                  {t.name && <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">name="{t.name}"</code>}
                  {t.property && <code className="text-xs bg-purple-50 px-2 py-0.5 rounded text-purple-700">property="{t.property}"</code>}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-gray-700 truncate max-w-xs">{t.content}</p>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button onClick={() => toggleActive(t)} className={`relative w-9 h-5 rounded-full transition-colors ${t.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.is_active ? 'translate-x-4' : ''}`} />
                  </button>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(t)} className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                    <button onClick={() => del(t)} className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900">{modal === 'add' ? 'Add Meta Tag' : 'Edit Meta Tag'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">name=""</label>
                  <input type="text" value={form.name} onChange={e => f('name', e.target.value)}
                    placeholder="theme-color" className={inputCls} />
                  <p className="text-[10px] text-gray-400 mt-1">For standard name attribute</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">property=""</label>
                  <input type="text" value={form.property} onChange={e => f('property', e.target.value)}
                    placeholder="fb:app_id" className={inputCls} />
                  <p className="text-[10px] text-gray-400 mt-1">For OG / RDFa property</p>
                </div>
              </div>

              {warning && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className="text-xs text-amber-700">{warning}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">content="" *</label>
                <input type="text" value={form.content} onChange={e => f('content', e.target.value)}
                  placeholder="#071A2B" className={inputCls} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button type="button" onClick={() => f('is_active', !form.is_active)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 font-mono">
                  Preview: &lt;meta {form.name ? `name="${form.name}"` : ''}{form.property ? `property="${form.property}"` : ''} content="{form.content || '…'}" /&gt;
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving}
                className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : modal === 'add' ? 'Add Tag' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors';
