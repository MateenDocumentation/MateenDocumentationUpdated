import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import MediaPicker from '../components/MediaPicker';
import type { Service } from '../types';
import { useSharedLabels } from '../hooks/useSharedLabels';

export default function ServicesManager() {
  const toast = useToast();
  const shared = useSharedLabels();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingLabels, setSavingLabels] = useState(false);

  useEffect(() => {
    supabase.from('services').select('*').order('order_index').then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, []);

  async function toggleActive(service: Service) {
    const is_active = !service.is_active;
    await supabase.from('services').update({ is_active, updated_at: new Date().toISOString() }).eq('id', service.id);
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active } : s));
    toast(is_active ? 'Service enabled' : 'Service disabled');
  }

  async function toggleFeatured(service: Service) {
    const is_featured = !service.is_featured;
    await supabase.from('services').update({ is_featured, updated_at: new Date().toISOString() }).eq('id', service.id);
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_featured } : s));
    toast(is_featured ? 'Marked as featured' : 'Removed from featured');
  }

  async function saveService() {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase.from('services')
      .update({ ...editing, updated_at: new Date().toISOString() })
      .eq('id', editing.id);
    setSaving(false);
    if (error) { toast('Save failed: ' + error.message, 'error'); return; }
    setServices(prev => prev.map(s => s.id === editing.id ? editing : s));
    setEditing(null);
    toast('Service saved');
  }

  async function saveSharedServiceLabels() {
    setSavingLabels(true);
    try {
      await shared.saveLabels();
      toast('Shared service labels saved');
    } catch (error: any) {
      toast('Shared labels failed: ' + (error?.message ?? 'Unknown error'), 'error');
    } finally {
      setSavingLabels(false);
    }
  }

  function moveService(index: number, dir: -1 | 1) {
    const next = [...services];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setServices(next);
    next.forEach((s, i) => supabase.from('services').update({ order_index: i }).eq('id', s.id));
  }

  if (loading || shared.loading) return (
    <div className="p-8"><div className="animate-pulse h-40 bg-gray-100 rounded-2xl" /></div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <p className="text-sm text-gray-400 mt-1">Manage service listings, descriptions, and display order</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-5xl mb-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shared Service Page Labels</h2>
            <p className="text-xs text-gray-400 mt-1">These labels are used across all individual service detail pages.</p>
          </div>
          <button
            onClick={saveSharedServiceLabels}
            disabled={savingLabels}
            className="px-4 py-2 text-xs font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60"
          >
            {savingLabels ? 'Saving...' : 'Save Shared Labels'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Service eyebrow" value={shared.getLabel('service', 'Service')} onChange={v => shared.setLabel('service', v)} />
          <Field label="Available Services" value={shared.getLabel('available_services', 'Available Services')} onChange={v => shared.setLabel('available_services', v)} />
          <Field label="What We Offer" value={shared.getLabel('what_we_offer', 'What We Offer')} onChange={v => shared.setLabel('what_we_offer', v)} />
          <Field label="Simple Process" value={shared.getLabel('simple_process', 'Simple Process')} onChange={v => shared.setLabel('simple_process', v)} />
          <Field label="How We Help" value={shared.getLabel('how_we_help', 'How We Help You')} onChange={v => shared.setLabel('how_we_help', v)} />
          <Field label="Explore More" value={shared.getLabel('explore_more', 'Explore More')} onChange={v => shared.setLabel('explore_more', v)} />
          <Field label="Related heading" value={shared.getLabel('you_might_need', 'You Might Also Need')} onChange={v => shared.setLabel('you_might_need', v)} />
          <Field label="WhatsApp button" value={shared.getLabel('whatsapp_us', 'WhatsApp Us')} onChange={v => shared.setLabel('whatsapp_us', v)} />
          <Field label="Send Requirement button" value={shared.getLabel('send_requirement', 'Send Requirement Online')} onChange={v => shared.setLabel('send_requirement', v)} />
          <Field label="Call button" value={shared.getLabel('call_now', 'Call Now')} onChange={v => shared.setLabel('call_now', v)} />
          <Field label="About section heading" value={shared.getLabel('about_service', 'About This Service')} onChange={v => shared.setLabel('about_service', v)} />
          <Field label="Explore link" value={shared.getLabel('explore', 'Explore')} onChange={v => shared.setLabel('explore', v)} />
          <Field label="Final CTA eyebrow" value={shared.getLabel('get_started_eyebrow', 'Get Started Today')} onChange={v => shared.setLabel('get_started_eyebrow', v)} />
          <Field label="Final CTA heading" value={shared.getLabel('ready_heading', 'Ready to Get Started?')} onChange={v => shared.setLabel('ready_heading', v)} />
          <Field label="WhatsApp Now button" value={shared.getLabel('whatsapp_now', 'WhatsApp Us Now')} onChange={v => shared.setLabel('whatsapp_now', v)} />
          <Field label="Order Online button" value={shared.getLabel('order_online', 'Order Online')} onChange={v => shared.setLabel('order_online', v)} />
          <Field label="Phone CTA" value={shared.getLabel('phone_cta', 'Call Now')} onChange={v => shared.setLabel('phone_cta', v)} />
          <div className="md:col-span-2 lg:col-span-3">
            <Field label="Final CTA description" value={shared.getLabel('ready_description', 'Visit us in H Block North Nazimabad, send your file online, or WhatsApp us now.')} onChange={v => shared.setLabel('ready_description', v)} textarea />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-5xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-4 py-3.5" />
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Service</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Tag</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Featured</th>
                <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Active</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveService(index, -1)} disabled={index === 0} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => moveService(index, 1)} disabled={index === services.length - 1} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {service.image_url && (
                        <img src={service.image_url} alt={service.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{service.title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{service.tag}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(service)}
                      className={`text-lg transition-opacity ${service.is_featured ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
                    >
                      ⭐
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(service)}
                      className={`w-9 h-5 rounded-full transition-colors ${service.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${service.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(service)}
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Edit Service</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <Field label="Title" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : null)} />
              <Field label="Tag / Category" value={editing.tag} onChange={v => setEditing(e => e ? { ...e, tag: v } : null)} />
              <Field label="Description" value={editing.description} onChange={v => setEditing(e => e ? { ...e, description: v } : null)} textarea />
              <MediaPicker label="Service image" value={editing.image_url ?? ''} onChange={v => setEditing(e => e ? { ...e, image_url: v } : null)} accept="image" help="Used on the service listing and service detail hero." />
              {editing.image_url && (
                <img src={editing.image_url} alt="preview" className="w-full h-32 object-cover rounded-xl border border-gray-100" />
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveService} disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
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
