import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { MediaAsset } from '../types';

type AcceptType = 'image' | 'video' | 'all';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: AcceptType;
  help?: string;
}

function matchesType(asset: MediaAsset, accept: AcceptType) {
  if (accept === 'all') return true;
  if (accept === 'video') return asset.type === 'video';
  return asset.type === 'image' || asset.type === 'svg';
}

export default function MediaPicker({ label, value, onChange, accept = 'image', help }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .then((result: { data: MediaAsset[] | null }) => {
        setAssets(result.data ?? []);
        setLoading(false);
      });
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter(asset => {
      if (!matchesType(asset, accept)) return false;
      if (!q) return true;
      return asset.filename.toLowerCase().includes(q)
        || (asset.title ?? '').toLowerCase().includes(q)
        || (asset.alt_text ?? '').toLowerCase().includes(q);
    });
  }, [assets, accept, search]);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        {value ? (
          <div className="relative bg-gray-50 border-b border-gray-100">
            {accept === 'video' ? (
              <video src={value} className="w-full h-28 object-cover" muted playsInline />
            ) : (
              <img src={value} alt="Selected media" className="w-full h-28 object-cover" />
            )}
          </div>
        ) : null}
        <div className="flex items-center gap-2 p-2.5">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Choose from Media Library or paste a URL"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-2 text-xs font-bold text-white bg-[#071A2B] rounded-lg hover:bg-[#0f2d47] whitespace-nowrap"
          >
            Media Library
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="px-2 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg">
              Clear
            </button>
          )}
        </div>
      </div>
      {help && <p className="text-[11px] text-gray-400 mt-1.5">{help}</p>}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50" onMouseDown={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[86vh] flex flex-col" onMouseDown={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Choose from Media Library</h3>
                <p className="text-xs text-gray-400 mt-0.5">Select {accept === 'all' ? 'an image or video' : accept === 'video' ? 'a video' : 'an image'}.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search media..."
                  autoFocus
                  className="px-3 py-2 rounded-lg border border-gray-200 text-xs w-52 focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15"
                />
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-sm text-gray-400">No matching media found.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filtered.map(asset => (
                    <button
                      type="button"
                      key={asset.id}
                      onClick={() => { onChange(asset.public_url); setOpen(false); }}
                      className="group text-left rounded-xl overflow-hidden border border-gray-100 hover:border-[#00AEEF] hover:ring-2 hover:ring-[#00AEEF]/20 transition-all bg-white"
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        {asset.type === 'video' ? (
                          <video src={asset.public_url} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img src={asset.public_url} alt={asset.alt_text ?? asset.filename} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-gray-700 truncate">{asset.title || asset.filename}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{asset.filename}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
