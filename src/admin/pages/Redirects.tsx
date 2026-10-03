import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { Redirect } from '../types';

const STATUS_CODES: Redirect['status_code'][] = [301, 302, 308];
const STATUS_LABELS: Record<number, string> = {
  301: '301 Permanent',
  302: '302 Temporary',
  308: '308 Permanent Redirect',
};

const emptyForm: Omit<Redirect, 'id' | 'created_at'> = {
  from_path: '',
  to_path: '',
  description: '',
  status_code: 301,
  is_active: true,
};

type FormState = Omit<Redirect, 'id' | 'created_at'>;

export default function Redirects() {
  const toast = useToast();
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'add' | Redirect>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [loopWarning, setLoopWarning] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('redirects').select('*').order('from_path').then(({ data }) => {
      setRedirects((data ?? []) as Redirect[]);
      setLoading(false);
    });
  }, []);

  function f<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(p => ({ ...p, [k]: v }));
    if (k === 'from_path' || k === 'to_path') {
      setLoopWarning('');
    }
  }

  // Detects redirect chains/loops: A→B, B→C checks that C doesn't loop back
  function detectLoop(from: string, to: string, existing: Redirect[], excludeId?: string): string {
    const map = new Map<string, string>();
    for (const r of existing) {
      if (r.id === excludeId) continue;
      map.set(r.from_path, r.to_path);
    }
    map.set(from, to);

    // Walk the chain from `from`
    let current = from;
    const visited = new Set<string>();
    while (map.has(current)) {
      if (visited.has(current)) {
        return `Redirect loop detected: ${[...visited, current].filter((_, i, a) => a.indexOf(current) <= i).join(' → ')}`;
      }
      visited.add(current);
      current = map.get(current)!;
    }

    // Check for chain (not a loop but still warn)
    if (visited.size > 1) {
      return `Redirect chain detected (${visited.size} hops). Chains slow down users. Consider pointing directly to the final destination.`;
    }

    return '';
  }

  function validateLoop() {
    if (!form.from_path || !form.to_path) return;
    if (form.from_path === form.to_path) {
      setLoopWarning('Source and destination cannot be the same path.');
      return;
    }
    const excludeId = modal !== 'add' && modal ? (modal as Redirect).id : undefined;
    const warning = detectLoop(form.from_path, form.to_path, redirects, excludeId);
    setLoopWarning(warning);
  }

  function openAdd() {
    setForm({ ...emptyForm });
    setLoopWarning('');
    setModal('add');
  }

  function openEdit(r: Redirect) {
    setForm({
      from_path: r.from_path,
      to_path: r.to_path,
      description: r.description ?? '',
      status_code: r.status_code,
      is_active: r.is_active,
    });
    setLoopWarning('');
    setModal(r);
  }

  async function save() {
    if (!form.from_path.trim()) { toast('Source path is required', 'error'); return; }
    if (!form.to_path.trim()) { toast('Destination path is required', 'error'); return; }
    if (form.from_path === form.to_path) { toast('Source and destination must differ', 'error'); return; }

    // Warn but don't block on chain (only block on true loop)
    const excludeId = modal !== 'add' && modal ? (modal as Redirect).id : undefined;
    const loopCheck = detectLoop(form.from_path, form.to_path, redirects, excludeId);
    if (loopCheck.startsWith('Redirect loop')) {
      toast(loopCheck, 'error');
      return;
    }

    setSaving(true);
    const payload = { ...form };

    if (modal === 'add') {
      const { data, error } = await supabase.from('redirects').insert(payload).select().single();
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setRedirects(prev => [...prev, data as Redirect].sort((a, b) => a.from_path.localeCompare(b.from_path)));
    } else {
      const r = modal as Redirect;
      const { error } = await supabase.from('redirects').update(payload).eq('id', r.id);
      if (error) { toast('Failed: ' + error.message, 'error'); setSaving(false); return; }
      setRedirects(prev => prev.map(x => x.id === r.id ? { ...x, ...payload } : x));
    }

    setSaving(false);
    setModal(null);
    toast(modal === 'add' ? 'Redirect added' : 'Redirect saved');
  }

  async function toggleActive(r: Redirect) {
    const is_active = !r.is_active;
    const { error } = await supabase.from('redirects').update({ is_active }).eq('id', r.id);
    if (error) { toast('Failed', 'error'); return; }
    setRedirects(prev => prev.map(x => x.id === r.id ? { ...x, is_active } : x));
  }

  async function del(r: Redirect) {
    if (!confirm(`Delete redirect ${r.from_path} → ${r.to_path}?`)) return;
    const { error } = await supabase.from('redirects').delete().eq('id', r.id);
    if (error) { toast('Delete failed', 'error'); return; }
    setRedirects(prev => prev.filter(x => x.id !== r.id));
    toast('Redirect deleted');
  }

  const filtered = redirects.filter(r =>
    !search || r.from_path.includes(search) || r.to_path.includes(search) || (r.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<number, string> = {
    301: 'bg-blue-50 text-blue-700',
    302: 'bg-amber-50 text-amber-700',
    308: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Redirect Manager</h1>
          <p className="text-sm text-gray-400 mt-1">301/302/308 redirects with loop detection</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search paths…"
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
          />
          <button
            onClick={openAdd}
            className="px-4 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] transition-colors"
          >
            + Add Redirect
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">From</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">To</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-28">Type</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-20">Active</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    {search ? 'No redirects match your search.' : 'No redirects yet. Add your first above.'}
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className={`hover:bg-gray-50/40 transition-colors ${!r.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-3.5">
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{r.from_path}</code>
                    {r.description && <p className="text-[11px] text-gray-400 mt-0.5">{r.description}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{r.to_path}</code>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[r.status_code]}`}>
                      {r.status_code}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => toggleActive(r)} className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${r.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${r.is_active ? 'translate-x-4' : ''}`} />
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                      <button onClick={() => del(r)} className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900">{modal === 'add' ? 'Add Redirect' : 'Edit Redirect'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Source Path *</label>
                <input
                  type="text"
                  value={form.from_path}
                  onChange={e => f('from_path', e.target.value)}
                  onBlur={validateLoop}
                  placeholder="/old-page"
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">Must start with /. This path on your site redirects elsewhere.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Destination *</label>
                <input
                  type="text"
                  value={form.to_path}
                  onChange={e => f('to_path', e.target.value)}
                  onBlur={validateLoop}
                  placeholder="/new-page or https://example.com/page"
                  className={inputCls}
                />
              </div>

              {loopWarning && (
                <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border ${
                  loopWarning.startsWith('Redirect loop') ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                }`}>
                  <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${loopWarning.startsWith('Redirect loop') ? 'text-red-500' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className={`text-xs ${loopWarning.startsWith('Redirect loop') ? 'text-red-700' : 'text-amber-700'}`}>{loopWarning}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Status Code</label>
                <div className="flex gap-2">
                  {STATUS_CODES.map(code => (
                    <button key={code} type="button" onClick={() => f('status_code', code)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${
                        form.status_code === code ? 'border-[#071A2B] bg-[#EEF7FF] text-[#071A2B]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {code}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{STATUS_LABELS[form.status_code]}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description <span className="text-gray-400 font-normal">(internal note)</span></label>
                <input type="text" value={form.description ?? ''} onChange={e => f('description', e.target.value)}
                  placeholder="e.g. Old service page renamed" className={inputCls} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button type="button" onClick={() => f('is_active', !form.is_active)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving || loopWarning.startsWith('Redirect loop') || form.from_path === form.to_path}
                className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : modal === 'add' ? 'Add Redirect' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors';
