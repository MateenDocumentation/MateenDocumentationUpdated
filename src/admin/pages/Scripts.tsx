import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import { useAuditLog } from '../hooks/useAuditLog';
import type { CustomScript, ScriptLocation } from '../types';

const LOCATIONS: { value: ScriptLocation; label: string; desc: string }[] = [
  { value: 'head_start', label: 'Head Start',  desc: 'First inside <head>' },
  { value: 'head_end',   label: 'Head End',    desc: 'Last inside <head>' },
  { value: 'body_start', label: 'Body Start',  desc: 'First inside <body>' },
  { value: 'body_end',   label: 'Body End',    desc: 'Last inside <body> — best for analytics' },
];

const empty: Omit<CustomScript, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  location: 'head_end',
  content: '',
  is_active: true,
  priority: 10,
};

interface FormState extends Omit<CustomScript, 'id' | 'created_at' | 'updated_at'> {}

export default function Scripts() {
  const toast = useToast();
  const auditLog = useAuditLog();
  const [scripts, setScripts] = useState<CustomScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'add' | CustomScript>(null);
  const [form, setForm] = useState<FormState>({ ...empty });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('custom_scripts')
      .select('*')
      .order('priority')
      .order('name')
      .then(({ data }) => { setScripts((data ?? []) as CustomScript[]); setLoading(false); });
  }, []);

  function openAdd() {
    setForm({ ...empty });
    setModal('add');
  }

  function openEdit(s: CustomScript) {
    setForm({
      name: s.name,
      description: s.description ?? '',
      location: s.location,
      content: s.content,
      is_active: s.is_active,
      priority: s.priority,
    });
    setModal(s);
  }

  function f<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function save() {
    if (!form.name.trim()) { toast('Name is required', 'error'); return; }
    if (!form.content.trim()) { toast('Script code is required', 'error'); return; }
    setSaving(true);

    const payload = { ...form, updated_at: new Date().toISOString() };

    if (modal === 'add') {
      const { data, error } = await supabase.from('custom_scripts').insert(payload).select().single();
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setScripts(prev => [...prev, data as CustomScript].sort((a, b) => a.priority - b.priority));
    } else {
      const s = modal as CustomScript;
      const { error } = await supabase.from('custom_scripts').update(payload).eq('id', s.id);
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setScripts(prev => prev.map(x => x.id === s.id ? { ...x, ...payload } : x));
    }

    setSaving(false);
    setModal(null);
    await auditLog(modal === 'add' ? 'script_add' : 'script_save', 'custom_scripts', undefined, { name: form.name });
    toast(modal === 'add' ? 'Script added' : 'Script saved');
  }

  async function toggleActive(s: CustomScript) {
    const is_active = !s.is_active;
    const { error } = await supabase.from('custom_scripts').update({ is_active }).eq('id', s.id);
    if (error) { toast('Failed to toggle', 'error'); return; }
    setScripts(prev => prev.map(x => x.id === s.id ? { ...x, is_active } : x));
  }

  async function del(s: CustomScript) {
    if (!confirm(`Delete script "${s.name}"?`)) return;
    setDeleting(s.id);
    const { error } = await supabase.from('custom_scripts').delete().eq('id', s.id);
    setDeleting(null);
    if (error) { toast('Delete failed', 'error'); return; }
    setScripts(prev => prev.filter(x => x.id !== s.id));
    await auditLog('script_delete', 'custom_scripts', s.id, { name: s.name });
    toast('Script deleted');
  }

  const locationLabel = (loc: ScriptLocation) => LOCATIONS.find(l => l.value === loc)?.label ?? loc;
  const locationColor: Record<ScriptLocation, string> = {
    head_start: 'bg-purple-50 text-purple-700',
    head_end:   'bg-blue-50 text-blue-700',
    body_start: 'bg-amber-50 text-amber-700',
    body_end:   'bg-emerald-50 text-emerald-700',
  };

  const byLocation = (loc: ScriptLocation) => scripts.filter(s => s.location === loc);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Script Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Inject scripts into HEAD or BODY — analytics, chat widgets, pixels</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] transition-colors"
        >
          + Add Script
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <div>
          <p className="text-xs font-bold text-amber-800">Security Warning — SUPER_ADMIN Only</p>
          <p className="text-xs text-amber-700 mt-0.5">Scripts execute on the <strong>public website only</strong> — never inside the admin panel. Only inject trusted, verified script code. Malicious scripts can steal user data and compromise your site. Scripts are not executed or previewed here.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : scripts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No scripts yet. Add your first script above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(['head_start', 'head_end', 'body_start', 'body_end'] as ScriptLocation[]).map(loc => {
            const group = byLocation(loc);
            if (group.length === 0) return null;
            const meta = LOCATIONS.find(l => l.value === loc)!;
            return (
              <div key={loc}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${locationColor[loc]}`}>{meta.label}</span>
                  <span className="text-xs text-gray-400">{meta.desc}</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                  {group.map(s => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${s.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.is_active ? 'translate-x-4' : ''}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${s.is_active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{s.name}</p>
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded font-mono">priority {s.priority}</span>
                        </div>
                        {s.description && <p className="text-xs text-gray-400 truncate mt-0.5">{s.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => openEdit(s)} className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                        <button onClick={() => del(s)} disabled={deleting === s.id} className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900">{modal === 'add' ? 'Add Script' : 'Edit Script'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Script Name *</label>
                  <input type="text" value={form.name} onChange={e => f('name', e.target.value)}
                    placeholder="Google Analytics, Hotjar, etc." className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority <span className="text-gray-400 font-normal">(lower = first)</span></label>
                  <input type="number" value={form.priority} onChange={e => f('priority', parseInt(e.target.value) || 10)}
                    min={1} max={100} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description <span className="text-gray-400 font-normal">(internal note)</span></label>
                <input type="text" value={form.description ?? ''} onChange={e => f('description', e.target.value)}
                  placeholder="What this script does…" className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Placement</label>
                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.map(l => (
                    <button key={l.value} type="button" onClick={() => f('location', l.value)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        form.location === l.value ? 'border-[#071A2B] bg-[#EEF7FF]' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${form.location === l.value ? 'border-[#071A2B]' : 'border-gray-300'}`}>
                        {form.location === l.value && <div className="w-1.5 h-1.5 rounded-full bg-[#071A2B]" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{l.label}</p>
                        <p className="text-[10px] text-gray-400">{l.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Script Code *</label>
                <textarea value={form.content} onChange={e => f('content', e.target.value)}
                  rows={10} placeholder={'<script>\n  // Your script here\n</script>'}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] resize-none" />
                <p className="text-[11px] text-gray-400 mt-1">Include the full &lt;script&gt;…&lt;/script&gt; tags or raw JS as appropriate.</p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button type="button" onClick={() => f('is_active', !form.is_active)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">Active (inject on public site)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : modal === 'add' ? 'Add Script' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors';
