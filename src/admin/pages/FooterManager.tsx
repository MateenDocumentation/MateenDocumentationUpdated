import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { FooterSettings, FooterServiceLink, FooterQuickLink } from '../types';

export default function FooterManager() {
  const toast = useToast();
  const [settings, setSettings] = useState<Partial<FooterSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'brand' | 'links' | 'contact' | 'legal'>('brand');

  useEffect(() => {
    supabase.from('footer_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  function set<K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) {
    setSettings(s => ({ ...s, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from('footer_settings').upsert({
      ...settings,
      id: settings.id ?? '1',
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) toast('Save failed: ' + error.message, 'error');
    else toast('Footer settings saved');
  }

  // Service links helpers
  const serviceLinks: FooterServiceLink[] = settings.service_links ?? [];
  const quickLinks: FooterQuickLink[] = settings.quick_links ?? [];

  function updateServiceLink(index: number, changes: Partial<FooterServiceLink>) {
    const next = serviceLinks.map((l, i) => i === index ? { ...l, ...changes } : l);
    set('service_links', next);
  }
  function removeServiceLink(index: number) {
    set('service_links', serviceLinks.filter((_, i) => i !== index));
  }
  function addServiceLink() {
    set('service_links', [...serviceLinks, { label: 'New Link', url: '/', enabled: true }]);
  }

  function updateQuickLink(index: number, changes: Partial<FooterQuickLink>) {
    const next = quickLinks.map((l, i) => i === index ? { ...l, ...changes } : l);
    set('quick_links', next);
  }
  function removeQuickLink(index: number) {
    set('quick_links', quickLinks.filter((_, i) => i !== index));
  }
  function addQuickLink() {
    set('quick_links', [...quickLinks, { label: 'New Link', url: '/', enabled: true }]);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse h-40 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Footer Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Changes apply to the live website footer</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {(['brand', 'links', 'contact', 'legal'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t ? 'bg-white text-[#071A2B] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'brand' ? 'Brand' : t === 'links' ? 'Links' : t === 'contact' ? 'Contact' : 'Legal'}
          </button>
        ))}
      </div>

      {tab === 'brand' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-4">
          <Field label="Tagline" value={settings.tagline ?? ''} onChange={v => set('tagline', v)} placeholder="Where Printing Meets Documentation" />
          <Field label="Description" value={settings.description ?? ''} onChange={v => set('description', v)} placeholder="A multi-service printing..." textarea />
          <Field label="Trusted Since" value={settings.trusted_since ?? ''} onChange={v => set('trusted_since', v)} placeholder="2005" />
        </div>
      )}

      {tab === 'links' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          {/* Service Links */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Service Links</h2>
              <button onClick={addServiceLink} className="text-xs font-semibold text-[#00AEEF] hover:underline">+ Add</button>
            </div>
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {serviceLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  link={link}
                  onChange={changes => updateServiceLink(i, changes)}
                  onRemove={() => removeServiceLink(i)}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Quick Links</h2>
              <button onClick={addQuickLink} className="text-xs font-semibold text-[#00AEEF] hover:underline">+ Add</button>
            </div>
            <div className="divide-y divide-gray-50">
              {quickLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  link={link}
                  onChange={changes => updateQuickLink(i, changes)}
                  onRemove={() => removeQuickLink(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-4">
          <Field label="Phone" value={settings.phone ?? ''} onChange={v => set('phone', v)} placeholder="+92 331 2478337" />
          <Field label="WhatsApp" value={settings.whatsapp ?? ''} onChange={v => set('whatsapp', v)} placeholder="+92 331 2478337" />
          <Field label="Email" value={settings.email ?? ''} onChange={v => set('email', v)} placeholder="mateendocumentation@gmail.com" />
          <Field label="Address" value={settings.address ?? ''} onChange={v => set('address', v)} placeholder="Shop# 1, A&Z Comforts..." textarea />
          <Field label="Google Maps URL" value={settings.maps_url ?? ''} onChange={v => set('maps_url', v)} placeholder="https://maps.app.goo.gl/..." />
        </div>
      )}

      {tab === 'legal' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-4">
          <Field label="Copyright text" value={settings.copyright_text ?? ''} onChange={v => set('copyright_text', v)} placeholder="© 2025 Mateen Documentation. All Rights Reserved." />
          <Field label="Developer credit name" value={settings.developer_credit ?? ''} onChange={v => set('developer_credit', v)} placeholder="BrandBugs" />
          <Field label="Developer URL" value={settings.developer_url ?? ''} onChange={v => set('developer_url', v)} placeholder="https://www.brandbugs.net" />
        </div>
      )}
    </div>
  );
}

function LinkRow({ link, onChange, onRemove }: {
  link: { label: string; url: string; enabled: boolean };
  onChange: (c: Partial<{ label: string; url: string; enabled: boolean }>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <button
        onClick={() => onChange({ enabled: !link.enabled })}
        className={`w-7 h-4 rounded-full transition-colors flex-shrink-0 ${link.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
      >
        <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 ${link.enabled ? 'translate-x-3' : 'translate-x-0'}`} />
      </button>
      <input
        value={link.label}
        onChange={e => onChange({ label: e.target.value })}
        className="flex-1 text-sm text-gray-800 bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none"
      />
      <input
        value={link.url}
        onChange={e => onChange({ url: e.target.value })}
        className="w-32 text-xs text-gray-400 bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none"
      />
      <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors"
        />
      )}
    </div>
  );
}
