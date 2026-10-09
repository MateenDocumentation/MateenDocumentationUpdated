import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { HeaderSettings, NavigationItem } from '../types';
import { useSharedLabels } from '../hooks/useSharedLabels';

const defaultHeader: Omit<HeaderSettings, 'id' | 'updated_at'> = {
  phone: '+92 331 2478337',
  whatsapp: '923312478337',
  cta_label: 'WhatsApp Us',
  cta_url: 'https://wa.me/923312478337',
};

const defaultNavItems: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>[] = [
  { label: 'Home', url: '/', order_index: 0, is_enabled: true, has_dropdown: false, parent_id: null },
  { label: 'About', url: '/about', order_index: 1, is_enabled: true, has_dropdown: false, parent_id: null },
  { label: 'Services', url: '/services', order_index: 2, is_enabled: true, has_dropdown: true, parent_id: null },
  { label: 'Order Online', url: '/order-online', order_index: 3, is_enabled: true, has_dropdown: false, parent_id: null },
  { label: 'Contact', url: '/contact', order_index: 4, is_enabled: true, has_dropdown: false, parent_id: null },
];

const serviceDropdownDefaults: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>[] = [
  { label: 'Printing & Photocopy', url: '/services/printing-photocopy', order_index: 0, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Student & Assignment Services', url: '/services/assignment-printing-binding', order_index: 1, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Customized Printing', url: '/services/customized-printing', order_index: 2, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'PVC Cards & Photo Frames', url: '/services/cards-photo-frames', order_index: 3, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Design & Branding', url: '/services/design-branding', order_index: 4, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Office & School Stationery', url: '/services/stationery', order_index: 5, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Legal Documentation', url: '/services/legal-documentation', order_index: 6, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'NADRA / Biometric / Public Facilitation', url: '/services/nadra-biometric-public-facilitation', order_index: 7, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Vehicle Documentation', url: '/services/vehicle-documentation', order_index: 8, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Business Documentation', url: '/services/business-documentation', order_index: 9, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Insurance Facilitation', url: '/services/insurance-facilitation', order_index: 10, is_enabled: true, has_dropdown: false, parent_id: 'services' },
  { label: 'Bulk Printing', url: '/services/bulk-printing', order_index: 11, is_enabled: true, has_dropdown: false, parent_id: 'services' },
];

export default function HeaderManager() {
  const toast = useToast();
  const shared = useSharedLabels();
  const [settings, setSettings] = useState<Partial<HeaderSettings>>(defaultHeader);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [dropdownItems, setDropdownItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'contact' | 'navigation' | 'dropdown'>('contact');

  useEffect(() => {
    async function load() {
      const [hRes, nRes] = await Promise.all([
        supabase.from('header_settings').select('*').single(),
        supabase.from('navigation_items').select('*').order('order_index'),
      ]);
      if (hRes.data) setSettings(hRes.data);
      if (nRes.data) {
        setNavItems(nRes.data.filter(i => !i.parent_id));
        setDropdownItems(nRes.data.filter(i => !!i.parent_id));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase.from('header_settings').upsert({
      ...settings,
      id: settings.id ?? '1',
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      try {
        await shared.saveLabels();
      } catch (sharedError: any) {
        setSaving(false);
        toast('Header saved, but shared labels failed: ' + (sharedError?.message ?? 'Unknown error'), 'error');
        return;
      }
    }
    setSaving(false);
    if (error) toast('Failed to save: ' + error.message, 'error');
    else toast('Header settings and labels saved');
  }

  async function updateNavItem(item: NavigationItem, changes: Partial<NavigationItem>) {
    const updated = { ...item, ...changes, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('navigation_items').update(changes).eq('id', item.id);
    if (error) { toast('Save failed', 'error'); return; }
    setNavItems(prev => prev.map(i => i.id === item.id ? updated : i));
    toast('Saved');
  }

  async function updateDropdownItem(item: NavigationItem, changes: Partial<NavigationItem>) {
    const updated = { ...item, ...changes, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('navigation_items').update(changes).eq('id', item.id);
    if (error) { toast('Save failed', 'error'); return; }
    setDropdownItems(prev => prev.map(i => i.id === item.id ? updated : i));
    toast('Saved');
  }

  function moveNav(index: number, dir: -1 | 1) {
    const next = [...navItems];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setNavItems(next);
    next.forEach((item, i) => {
      supabase.from('navigation_items').update({ order_index: i }).eq('id', item.id);
    });
  }

  if (loading || shared.loading) return <PageShell title="Header Manager"><div className="animate-pulse h-40 bg-gray-100 rounded-2xl" /></PageShell>;

  return (
    <PageShell title="Header Manager">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(['contact', 'navigation', 'dropdown'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t ? 'bg-white text-[#071A2B] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'dropdown' ? 'Services Dropdown' : t === 'contact' ? 'Contact & CTA' : 'Navigation'}
          </button>
        ))}
      </div>

      {tab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
          <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider">Contact & CTA</h2>
          <div className="space-y-4">
            <Field label="Phone number" value={settings.phone ?? ''} onChange={v => setSettings(s => ({ ...s, phone: v }))} placeholder="+92 331 2478337" />
            <Field label="WhatsApp number (no spaces, with country code)" value={settings.whatsapp ?? ''} onChange={v => setSettings(s => ({ ...s, whatsapp: v }))} placeholder="923312478337" />
            <Field label="CTA Button label" value={settings.cta_label ?? ''} onChange={v => setSettings(s => ({ ...s, cta_label: v }))} placeholder="WhatsApp Us" />
            <Field label="CTA Button URL" value={settings.cta_url ?? ''} onChange={v => setSettings(s => ({ ...s, cta_url: v }))} placeholder="https://wa.me/..." />
            <div className="pt-3 mt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Public Header Labels</p>
              <div className="space-y-4">
                <Field label="View All Services label" value={shared.getLabel('header_view_all_services', 'View All Services')} onChange={v => shared.setLabel('header_view_all_services', v)} />
                <Field label="Desktop Call label" value={shared.getLabel('header_call', 'Call')} onChange={v => shared.setLabel('header_call', v)} />
                <Field label="Desktop WhatsApp label" value={shared.getLabel('header_whatsapp', 'WhatsApp')} onChange={v => shared.setLabel('header_whatsapp', v)} />
                <Field label="Mobile Call label" value={shared.getLabel('header_call_mobile', 'CALL')} onChange={v => shared.setLabel('header_call_mobile', v)} />
                <Field label="Mobile WhatsApp label" value={shared.getLabel('header_whatsapp_mobile', 'WHATSAPP')} onChange={v => shared.setLabel('header_whatsapp_mobile', v)} />
                <Field label="Mobile Send File label" value={shared.getLabel('header_send_file', 'SEND FILE')} onChange={v => shared.setLabel('header_send_file', v)} />
              </div>
            </div>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-6 px-5 py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {tab === 'navigation' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Navigation Items</h2>
            <p className="text-xs text-gray-400 mt-0.5">Reorder, enable/disable, edit labels and URLs</p>
          </div>
          <div className="divide-y divide-gray-50">
            {navItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 px-6 py-3.5">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveNav(index, -1)}
                    disabled={index === 0}
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveNav(index, 1)}
                    disabled={index === navItems.length - 1}
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => updateNavItem(item, { is_enabled: !item.is_enabled })}
                  className={`w-8 h-5 rounded-full transition-colors flex-shrink-0 ${item.is_enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform mx-0.5 ${item.is_enabled ? 'translate-x-3' : 'translate-x-0'}`} />
                </button>

                {/* Label */}
                <input
                  value={item.label}
                  onChange={e => setNavItems(prev => prev.map(i => i.id === item.id ? { ...i, label: e.target.value } : i))}
                  onBlur={e => updateNavItem(item, { label: e.target.value })}
                  className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-b border-transparent focus:border-[#071A2B]/30 focus:outline-none py-0.5"
                />

                {/* URL */}
                <input
                  value={item.url}
                  onChange={e => setNavItems(prev => prev.map(i => i.id === item.id ? { ...i, url: e.target.value } : i))}
                  onBlur={e => updateNavItem(item, { url: e.target.value })}
                  className="w-36 text-xs text-gray-400 bg-transparent border-b border-transparent focus:border-[#071A2B]/30 focus:outline-none py-0.5"
                />

                {item.has_dropdown && (
                  <span className="text-[10px] font-semibold text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-full">DROPDOWN</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'dropdown' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Services Dropdown Items</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage the mega-menu service links</p>
          </div>
          <div className="divide-y divide-gray-50">
            {dropdownItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                <button
                  onClick={() => updateDropdownItem(item, { is_enabled: !item.is_enabled })}
                  className={`w-8 h-5 rounded-full transition-colors flex-shrink-0 ${item.is_enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform mx-0.5 ${item.is_enabled ? 'translate-x-3' : 'translate-x-0'}`} />
                </button>
                <input
                  value={item.label}
                  onChange={e => setDropdownItems(prev => prev.map(i => i.id === item.id ? { ...i, label: e.target.value } : i))}
                  onBlur={e => updateDropdownItem(item, { label: e.target.value })}
                  className="flex-1 text-sm text-gray-800 bg-transparent border-b border-transparent focus:border-[#071A2B]/30 focus:outline-none py-0.5"
                />
                <input
                  value={item.url}
                  onChange={e => setDropdownItems(prev => prev.map(i => i.id === item.id ? { ...i, url: e.target.value } : i))}
                  onBlur={e => updateDropdownItem(item, { url: e.target.value })}
                  className="w-64 text-xs text-gray-400 bg-transparent border-b border-transparent focus:border-[#071A2B]/30 focus:outline-none py-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors"
      />
    </div>
  );
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">Changes apply to the live website header</p>
      </div>
      {children}
    </div>
  );
}
