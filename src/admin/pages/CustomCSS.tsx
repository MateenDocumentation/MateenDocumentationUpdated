import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { CustomCss } from '../types';

export default function CustomCSSPage() {
  const toast = useToast();
  const [record, setRecord] = useState<CustomCss | null>(null);
  const [css, setCss] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('custom_css').select('*').eq('id', '1').single().then(({ data }) => {
      if (data) {
        const d = data as CustomCss;
        setRecord(d);
        setCss(d.css);
        setIsActive(d.is_active);
      }
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    const payload = { css, is_active: isActive, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('custom_css').update(payload).eq('id', '1');
    setSaving(false);
    if (error) { toast('Save failed: ' + error.message, 'error'); return; }
    setRecord(prev => prev ? { ...prev, ...payload } : null);
    toast('Custom CSS saved');
  }

  const charCount = css.length;
  const charColor = charCount === 0 ? 'text-gray-400' : charCount > 50000 ? 'text-red-500' : charCount > 20000 ? 'text-amber-500' : 'text-emerald-600';

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Custom CSS</h1>
          <p className="text-sm text-gray-400 mt-1">Global CSS injected into the public site — for minor adjustments that don't require a deploy</p>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save CSS'}
        </button>
      </div>

      {/* Warnings */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-xs font-bold text-amber-800">Specificity Warning</p>
            <p className="text-xs text-amber-700 mt-0.5">Custom CSS is injected after site styles and will override them. Use specific selectors to target only what you intend. Avoid <code>!important</code> unless necessary. This CSS does not execute inside the admin panel.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs text-blue-800">For structural or component-level changes, update the codebase directly instead — custom CSS is best for minor visual tweaks and brand adjustments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-4' : ''}`} />
              </button>
              <span className="text-xs font-semibold text-gray-700">{isActive ? 'Active — injected on public site' : 'Inactive — not injected'}</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono tabular-nums ${charColor}`}>{charCount.toLocaleString()} chars</span>
            {record?.updated_at && (
              <span className="text-[11px] text-gray-400 hidden sm:block">
                Saved {new Date(record.updated_at).toLocaleString('en-PK')}
              </span>
            )}
          </div>
        </div>

        {/* Code area */}
        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-300 text-sm">Loading…</div>
        ) : (
          <textarea
            value={css}
            onChange={e => setCss(e.target.value)}
            rows={30}
            placeholder={`/* Custom global CSS */\n\n/* Example: override hero button radius */\n.btn-primary {\n  border-radius: 4px;\n}\n\n/* Example: custom font size for headings */\n.hero-heading {\n  font-size: clamp(2rem, 5vw, 4rem);\n}`}
            spellCheck={false}
            className="w-full px-5 py-4 text-sm font-mono text-gray-800 bg-white border-0 resize-none focus:outline-none leading-relaxed"
            style={{ minHeight: '480px', tabSize: 2 }}
          />
        )}
      </div>
    </div>
  );
}
