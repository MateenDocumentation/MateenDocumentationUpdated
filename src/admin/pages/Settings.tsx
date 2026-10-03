import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { SiteSettings } from '../types';

export default function Settings() {
  const toast = useToast();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings(s => ({ ...s, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({
      ...settings,
      id: settings.id ?? '1',
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) toast('Save failed: ' + error.message, 'error');
    else toast('Settings saved');
  }

  if (loading) return (
    <div className="p-8"><div className="animate-pulse h-40 bg-gray-100 rounded-2xl" /></div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Business information and contact details</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        <Section title="Business Identity">
          <Field label="Business name" value={settings.business_name ?? ''} onChange={v => set('business_name', v)} />
          <Field label="Tagline" value={settings.tagline ?? ''} onChange={v => set('tagline', v)} />
          <Field label="Logo URL" value={settings.logo_url ?? ''} onChange={v => set('logo_url', v)} />
          <Field label="Favicon URL" value={settings.favicon_url ?? ''} onChange={v => set('favicon_url', v)} />
        </Section>

        <Section title="Contact Information">
          <Field label="Phone" value={settings.phone ?? ''} onChange={v => set('phone', v)} />
          <Field label="WhatsApp" value={settings.whatsapp ?? ''} onChange={v => set('whatsapp', v)} />
          <Field label="Email" value={settings.email ?? ''} onChange={v => set('email', v)} />
        </Section>

        <Section title="Location">
          <Field label="Address" value={settings.address ?? ''} onChange={v => set('address', v)} textarea />
          <Field label="Google Maps URL" value={settings.maps_url ?? ''} onChange={v => set('maps_url', v)} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] resize-none" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]" />
      )}
    </div>
  );
}
