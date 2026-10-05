import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import type { Page, PageSection, SectionType } from '../types';

const SECTION_TYPES: { type: SectionType; label: string; icon: string }[] = [
  { type: 'hero', label: 'Hero', icon: '🦸' },
  { type: 'heading', label: 'Heading', icon: '📰' },
  { type: 'text', label: 'Text Block', icon: '📝' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'video', label: 'Video', icon: '🎬' },
  { type: 'image_text', label: 'Image + Text', icon: '📄' },
  { type: 'cta', label: 'Call to Action', icon: '🔘' },
  { type: 'cards', label: 'Cards', icon: '🃏' },
  { type: 'services_grid', label: 'Services Grid', icon: '⚙️' },
  { type: 'features', label: 'Features', icon: '✨' },
  { type: 'gallery', label: 'Gallery', icon: '🎨' },
  { type: 'faq', label: 'FAQ', icon: '❓' },
  { type: 'contact', label: 'Contact Block', icon: '📬' },
  { type: 'service_strip', label: 'Service Strip', icon: '🧩' },
  { type: 'printing_feature', label: 'Printing Feature', icon: '🖨️' },
  { type: 'academic_feature', label: 'Academic Feature', icon: '🎓' },
  { type: 'how_it_works', label: 'How It Works', icon: '🪜' },
  { type: 'customized_printing', label: 'Customized Printing', icon: '🎨' },
  { type: 'who_we_serve', label: 'Who We Serve', icon: '👥' },
  { type: 'final_cta', label: 'Final CTA', icon: '📣' },
];

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [addingSection, setAddingSection] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('pages').select('*').eq('id', id).single(),
      supabase.from('page_sections').select('*').eq('page_id', id).order('order_index'),
    ]).then(([pRes, sRes]) => {
      setPage(pRes.data ?? null);
      setSections(sRes.data ?? []);
      setLoading(false);
    });
  }, [id]);

  async function toggleVisibility(section: PageSection) {
    const is_visible = !section.is_visible;
    const { error } = await supabase.from('page_sections').update({ is_visible, updated_at: new Date().toISOString() }).eq('id', section.id);
    if (error) { toast('Failed', 'error'); return; }
    setSections(prev => prev.map(s => s.id === section.id ? { ...s, is_visible } : s));
    toast(is_visible ? 'Section visible' : 'Section hidden');
  }

  async function deleteSection(section: PageSection) {
    if (!confirm(`Delete "${section.label ?? section.type}" section? This cannot be undone.`)) return;
    const { error } = await supabase.from('page_sections').delete().eq('id', section.id);
    if (error) { toast('Delete failed', 'error'); return; }
    setSections(prev => prev.filter(s => s.id !== section.id));
    toast('Section deleted');
  }

  async function duplicateSection(section: PageSection) {
    const newSection: Partial<PageSection> = {
      page_id: section.page_id,
      type: section.type,
      label: (section.label ?? section.type) + ' (Copy)',
      order_index: section.order_index + 0.5,
      is_visible: false,
      content: { ...section.content },
    };
    const { data, error } = await supabase.from('page_sections').insert(newSection).select().single();
    if (error) { toast('Duplicate failed', 'error'); return; }
    if (data) {
      const next = [...sections, data].sort((a, b) => a.order_index - b.order_index);
      setSections(next);
      next.forEach((s, i) => supabase.from('page_sections').update({ order_index: i }).eq('id', s.id));
      toast('Section duplicated');
    }
  }

  async function moveSection(index: number, dir: -1 | 1) {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    await Promise.all(next.map((s, i) => supabase.from('page_sections').update({ order_index: i }).eq('id', s.id)));
  }

  async function addSection(type: SectionType) {
    if (!id) return;
    const defaults = getDefaultContent(type);
    const newSection: Partial<PageSection> = {
      page_id: id,
      type,
      label: SECTION_TYPES.find(t => t.type === type)?.label ?? type,
      order_index: sections.length,
      is_visible: true,
      content: defaults,
    };
    const { data, error } = await supabase.from('page_sections').insert(newSection).select().single();
    if (error) { toast('Add failed: ' + error.message, 'error'); return; }
    if (data) {
      setSections(prev => [...prev, data]);
      setAddingSection(false);
      toast('Section added');
    }
  }

  async function saveSection(section: PageSection) {
    const { error } = await supabase.from('page_sections')
      .update({ content: section.content, label: section.label, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (error) { toast('Save failed', 'error'); return; }
    setSections(prev => prev.map(s => s.id === section.id ? section : s));
    setEditingSection(null);
    toast('Section saved');
  }

  if (loading) return (
    <div className="p-8">
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );

  if (!page) return (
    <div className="p-8 text-center text-gray-400">Page not found.</div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin/pages" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{page.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <code className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{page.slug}</code>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              page.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>{page.status}</span>
          </div>
        </div>
      </div>

      {/* Sections list */}
      <div className="space-y-2 mb-4 max-w-3xl">
        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm">No sections yet. Add your first section below.</p>
          </div>
        )}
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`bg-white rounded-xl border transition-colors ${section.is_visible ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <span className="text-lg">{SECTION_TYPES.find(t => t.type === section.type)?.icon ?? '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{section.label ?? section.type}</p>
                <p className="text-xs text-gray-400 capitalize">{section.type.replace('_', ' ')}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility */}
                <button
                  onClick={() => toggleVisibility(section)}
                  title={section.is_visible ? 'Hide section' : 'Show section'}
                  className={`p-1.5 rounded-lg transition-colors ${section.is_visible ? 'text-[#071A2B] hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {section.is_visible
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    }
                  </svg>
                </button>

                <button
                  onClick={() => setEditingSection(section)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#071A2B] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => duplicateSection(section)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => deleteSection(section)}
                  className="p-1.5 rounded-lg text-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add section */}
      {addingSection ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Choose section type</h3>
            <button onClick={() => setAddingSection(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SECTION_TYPES.map(t => (
              <button
                key={t.type}
                onClick={() => addSection(t.type)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-100 hover:border-[#00AEEF]/40 hover:bg-[#EEF7FF]/50 transition-all text-left"
              >
                <span>{t.icon}</span>
                <span className="text-sm font-medium text-gray-800">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#071A2B] border border-dashed border-gray-300 rounded-xl hover:border-[#071A2B] hover:bg-gray-50 transition-colors max-w-3xl w-full justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Section
        </button>
      )}

      {/* Section edit modal */}
      {editingSection && (
        <SectionEditModal
          section={editingSection}
          onChange={s => setEditingSection(s)}
          onSave={saveSection}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}

// ─── Section edit modal ───────────────────────────────────────────────────

function SectionEditModal({
  section,
  onChange,
  onSave,
  onClose,
}: {
  section: PageSection;
  onChange: (s: PageSection) => void;
  onSave: (s: PageSection) => void;
  onClose: () => void;
}) {
  function setContent(key: string, value: unknown) {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  }

  const c = section.content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Edit: {section.label}</h2>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{section.type.replace('_', ' ')} section</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Section label */}
          <Field label="Section label (internal)" value={section.label ?? ''} onChange={v => onChange({ ...section, label: v })} />

          {/* Hero */}
          {section.type === 'hero' && (<>
            <Field label="Heading (H1)" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <Field label="Subheading" value={str(c.subheading)} onChange={v => setContent('subheading', v)} />
            <Field label="Description" value={str(c.description)} onChange={v => setContent('description', v)} textarea />
            <Field label="Badge text" value={str(c.badge)} onChange={v => setContent('badge', v)} />
            <Field label="Primary CTA text" value={str(c.cta_primary_text) || str(c.cta_primary_label)} onChange={v => setContent('cta_primary_text', v)} />
            <Field label="Primary CTA URL" value={str(c.cta_primary_url)} onChange={v => setContent('cta_primary_url', v)} />
            <Field label="Secondary CTA text" value={str(c.cta_secondary_text) || str(c.cta_secondary_label)} onChange={v => setContent('cta_secondary_text', v)} />
            <Field label="Secondary CTA URL" value={str(c.cta_secondary_url)} onChange={v => setContent('cta_secondary_url', v)} />
            <Field label="Tertiary CTA text" value={str(c.cta_tertiary_text)} onChange={v => setContent('cta_tertiary_text', v)} />
            <Field label="Tertiary CTA URL" value={str(c.cta_tertiary_url)} onChange={v => setContent('cta_tertiary_url', v)} />
            <Field label="Video URL" value={str(c.video_url)} onChange={v => setContent('video_url', v)} />
            <Field label="Video poster URL" value={str(c.video_poster)} onChange={v => setContent('video_poster', v)} />
            <Field label="Image URL (fallback)" value={str(c.image_url)} onChange={v => setContent('image_url', v)} />
            <Field label="Alt text" value={str(c.alt_text)} onChange={v => setContent('alt_text', v)} />
          </>)}

          {/* Home: Service Strip */}
          {section.type === 'service_strip' && (
            <ServiceStripEditor
              items={objectArray(c.items)}
              onChange={items => setContent('items', items)}
            />
          )}

          {/* Home: Printing Feature */}
          {section.type === 'printing_feature' && (<>
            <Field label="Heading" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <Field label="Description" value={str(c.description)} onChange={v => setContent('description', v)} textarea />
            <StringListEditor label="Checklist items" value={stringArray(c.checklist)} onChange={v => setContent('checklist', v)} />
            <Field label="CTA label" value={str(c.cta_label)} onChange={v => setContent('cta_label', v)} />
            <Field label="CTA URL" value={str(c.cta_url)} onChange={v => setContent('cta_url', v)} />
          </>)}

          {/* Home: Academic Feature */}
          {section.type === 'academic_feature' && (<>
            <Field label="Heading line 1" value={str(c.heading_line1)} onChange={v => setContent('heading_line1', v)} />
            <Field label="Heading line 2" value={str(c.heading_line2)} onChange={v => setContent('heading_line2', v)} />
            <Field label="Description" value={str(c.description)} onChange={v => setContent('description', v)} textarea />
            <StringListEditor label="Checklist items" value={stringArray(c.checklist)} onChange={v => setContent('checklist', v)} />
            <Field label="CTA label" value={str(c.cta_label)} onChange={v => setContent('cta_label', v)} />
            <Field label="WhatsApp message" value={str(c.wa_message)} onChange={v => setContent('wa_message', v)} textarea />
          </>)}

          {/* Home: How It Works */}
          {section.type === 'how_it_works' && (<>
            <Field label="Heading" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <Field label="Subtitle" value={str(c.subtitle)} onChange={v => setContent('subtitle', v)} textarea />
            <HowStepsEditor
              steps={objectArray(c.steps)}
              onChange={steps => setContent('steps', steps)}
            />
            <Field label="CTA label" value={str(c.cta_label)} onChange={v => setContent('cta_label', v)} />
            <Field label="WhatsApp message" value={str(c.wa_message)} onChange={v => setContent('wa_message', v)} textarea />
          </>)}

          {/* Home: Customized Printing */}
          {section.type === 'customized_printing' && (<>
            <Field label="Heading line 1" value={str(c.heading_line1)} onChange={v => setContent('heading_line1', v)} />
            <Field label="Heading line 2" value={str(c.heading_line2)} onChange={v => setContent('heading_line2', v)} />
            <Field label="Description" value={str(c.description)} onChange={v => setContent('description', v)} textarea />
            <StringListEditor label="Items" value={stringArray(c.items)} onChange={v => setContent('items', v)} />
            <Field label="CTA label" value={str(c.cta_label)} onChange={v => setContent('cta_label', v)} />
            <Field label="CTA URL" value={str(c.cta_url)} onChange={v => setContent('cta_url', v)} />
          </>)}

          {/* Home: Who We Serve */}
          {section.type === 'who_we_serve' && (<>
            <Field label="Eyebrow" value={str(c.eyebrow)} onChange={v => setContent('eyebrow', v)} />
            <Field label="Heading" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <ServePanelsEditor
              panels={objectArray(c.panels)}
              onChange={panels => setContent('panels', panels)}
            />
          </>)}

          {/* Home: Final CTA */}
          {section.type === 'final_cta' && (<>
            <Field label="Heading line 1" value={str(c.heading_line1)} onChange={v => setContent('heading_line1', v)} />
            <Field label="Heading line 2" value={str(c.heading_line2)} onChange={v => setContent('heading_line2', v)} />
            <Field label="Subline" value={str(c.subline)} onChange={v => setContent('subline', v)} textarea />
            <Field label="WhatsApp button label" value={str(c.wa_label)} onChange={v => setContent('wa_label', v)} />
            <Field label="WhatsApp message" value={str(c.wa_message)} onChange={v => setContent('wa_message', v)} textarea />
            <Field label="Phone button label" value={str(c.phone_label)} onChange={v => setContent('phone_label', v)} />
            <StringListEditor label="Service tags" value={stringArray(c.service_tags)} onChange={v => setContent('service_tags', v)} />
          </>)}

          {/* Heading */}
          {section.type === 'heading' && (<>
            <Field label="Heading text" value={str(c.text)} onChange={v => setContent('text', v)} />
            <Select label="Level" value={str(c.level) || 'h2'} onChange={v => setContent('level', v)}
              options={[{ value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }]} />
          </>)}

          {/* Text */}
          {section.type === 'text' && (
            <Field label="Content" value={str(c.text)} onChange={v => setContent('text', v)} textarea />
          )}

          {/* Image */}
          {section.type === 'image' && (<>
            <Field label="Image URL" value={str(c.url)} onChange={v => setContent('url', v)} />
            <Field label="Alt text" value={str(c.alt)} onChange={v => setContent('alt', v)} />
            <Field label="Caption" value={str(c.caption)} onChange={v => setContent('caption', v)} />
          </>)}

          {/* Video */}
          {section.type === 'video' && (<>
            <Field label="Video URL" value={str(c.url)} onChange={v => setContent('url', v)} />
            <Field label="Poster image URL" value={str(c.poster)} onChange={v => setContent('poster', v)} />
            <div className="flex items-center gap-2">
              <Toggle label="Autoplay" checked={!!c.autoplay} onChange={v => setContent('autoplay', v)} />
              <Toggle label="Loop" checked={!!c.loop} onChange={v => setContent('loop', v)} />
              <Toggle label="Muted" checked={!!c.muted} onChange={v => setContent('muted', v)} />
            </div>
          </>)}

          {/* Image + Text */}
          {section.type === 'image_text' && (<>
            <Field label="Heading" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <Field label="Body text" value={str(c.text)} onChange={v => setContent('text', v)} textarea />
            <Field label="Image URL" value={str(c.image_url)} onChange={v => setContent('image_url', v)} />
            <Field label="Alt text" value={str(c.alt)} onChange={v => setContent('alt', v)} />
            <Select label="Image position" value={str(c.image_position) || 'right'} onChange={v => setContent('image_position', v)}
              options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]} />
          </>)}

          {/* CTA */}
          {section.type === 'cta' && (<>
            <Field label="Heading" value={str(c.heading)} onChange={v => setContent('heading', v)} />
            <Field label="Subtext" value={str(c.subtext)} onChange={v => setContent('subtext', v)} />
            <Field label="Button label" value={str(c.button_label)} onChange={v => setContent('button_label', v)} />
            <Field label="Button URL" value={str(c.button_url)} onChange={v => setContent('button_url', v)} />
          </>)}

          {/* Generic JSON for complex types */}
          {['cards', 'services_grid', 'features', 'gallery', 'faq', 'contact'].includes(section.type) && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">Content (JSON)</p>
              <textarea
                value={JSON.stringify(c, null, 2)}
                onChange={e => {
                  try {
                    onChange({ ...section, content: JSON.parse(e.target.value) });
                  } catch { /* ignore parse errors */ }
                }}
                rows={12}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 resize-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">Edit structured content as JSON</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(section)} className="px-5 py-2 text-sm font-bold text-white bg-[#071A2B] rounded-xl hover:bg-[#0f2d47] transition-colors">Save Section</button>
        </div>
      </div>
    </div>
  );
}

function str(v: unknown): string { return typeof v === 'string' ? v : ''; }

function getDefaultContent(type: SectionType): Record<string, unknown> {
  const defaults: Record<SectionType, Record<string, unknown>> = {
    hero: {
      heading: '',
      subheading: '',
      description: '',
      badge: '',
      cta_primary_text: '',
      cta_primary_url: '',
      cta_secondary_text: '',
      cta_secondary_url: '',
      cta_tertiary_text: '',
      cta_tertiary_url: '',
      video_url: '',
      video_poster: '',
      image_url: '',
      alt_text: '',
    },

    service_strip: {
      items: [],
    },

    printing_feature: {
      heading: '',
      description: '',
      checklist: [],
      cta_label: '',
      cta_url: '',
    },

    academic_feature: {
      heading_line1: '',
      heading_line2: '',
      description: '',
      checklist: [],
      cta_label: '',
      wa_message: '',
    },

    how_it_works: {
      heading: '',
      subtitle: '',
      steps: [],
      cta_label: '',
      wa_message: '',
    },

    customized_printing: {
      heading_line1: '',
      heading_line2: '',
      description: '',
      items: [],
      cta_label: '',
      cta_url: '',
    },

    who_we_serve: {
      eyebrow: '',
      heading: '',
      panels: [],
    },

    final_cta: {
      heading_line1: '',
      heading_line2: '',
      subline: '',
      wa_label: '',
      wa_message: '',
      phone_label: '',
      service_tags: [],
    },

    heading: { text: '', level: 'h2' },
    text: { text: '' },
    image: { url: '', alt: '', caption: '' },
    video: { url: '', poster: '', autoplay: true, loop: true, muted: true },
    image_text: { heading: '', text: '', image_url: '', alt: '', image_position: 'right' },
    cta: { heading: '', subtext: '', button_label: 'Get in Touch', button_url: '/contact' },
    cards: { title: '', items: [] },
    services_grid: { title: '', items: [] },
    features: { title: '', items: [] },
    gallery: { title: '', images: [] },
    faq: { title: 'Frequently Asked Questions', items: [] },
    contact: { heading: '', subtext: '' },
  };
  return defaults[type] ?? {};
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


function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function objectArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object' && !Array.isArray(item))
    : [];
}

function StringListEditor({ label, value, onChange }: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <textarea
        value={value.join('\n')}
        onChange={e => onChange(e.target.value.split('\n').map(v => v.trim()).filter(Boolean))}
        rows={5}
        placeholder="One item per line"
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors resize-none"
      />
      <p className="text-[11px] text-gray-400 mt-1">Enter one item per line.</p>
    </div>
  );
}

function ServiceStripEditor({ items, onChange }: {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
}) {
  const update = (index: number, key: 'label' | 'url', value: string) => {
    const next = items.map((item, i) => i === index ? { ...item, [key]: value } : item);
    onChange(next);
  };
  const add = () => onChange([...items, { label: '', url: '' }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Service strip items</p>
        <button type="button" onClick={add} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50">+ Add item</button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Item {index + 1}</span>
            <button type="button" onClick={() => remove(index)} className="text-xs text-red-500">Remove</button>
          </div>
          <Field label="Label" value={str(item.label)} onChange={v => update(index, 'label', v)} />
          <Field label="URL" value={str(item.url)} onChange={v => update(index, 'url', v)} />
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-gray-400">No items yet.</p>}
    </div>
  );
}

function HowStepsEditor({ steps, onChange }: {
  steps: Record<string, unknown>[];
  onChange: (steps: Record<string, unknown>[]) => void;
}) {
  const update = (index: number, key: 'n' | 'title' | 'body', value: string) => {
    const next = steps.map((step, i) => i === index ? { ...step, [key]: value } : step);
    onChange(next);
  };
  const add = () => onChange([...steps, { n: String(steps.length + 1).padStart(2, '0'), title: '', body: '' }]);
  const remove = (index: number) => onChange(steps.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Process steps</p>
        <button type="button" onClick={add} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50">+ Add step</button>
      </div>
      {steps.map((step, index) => (
        <div key={index} className="rounded-xl border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Step {index + 1}</span>
            <button type="button" onClick={() => remove(index)} className="text-xs text-red-500">Remove</button>
          </div>
          <Field label="Number" value={str(step.n)} onChange={v => update(index, 'n', v)} />
          <Field label="Title" value={str(step.title)} onChange={v => update(index, 'title', v)} />
          <Field label="Body" value={str(step.body)} onChange={v => update(index, 'body', v)} textarea />
        </div>
      ))}
      {steps.length === 0 && <p className="text-xs text-gray-400">No steps yet.</p>}
    </div>
  );
}

function ServePanelsEditor({ panels, onChange }: {
  panels: Record<string, unknown>[];
  onChange: (panels: Record<string, unknown>[]) => void;
}) {
  const update = (index: number, key: string, value: unknown) => {
    const next = panels.map((panel, i) => i === index ? { ...panel, [key]: value } : panel);
    onChange(next);
  };
  const add = () => onChange([...panels, { title: '', description: '', tags: [], image: '', image_alt: '' }]);
  const remove = (index: number) => onChange(panels.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Audience panels</p>
        <button type="button" onClick={add} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50">+ Add panel</button>
      </div>
      {panels.map((panel, index) => (
        <div key={index} className="rounded-xl border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Panel {index + 1}</span>
            <button type="button" onClick={() => remove(index)} className="text-xs text-red-500">Remove</button>
          </div>
          <Field label="Title" value={str(panel.title)} onChange={v => update(index, 'title', v)} />
          <Field label="Description" value={str(panel.description)} onChange={v => update(index, 'description', v)} textarea />
          <StringListEditor label="Tags" value={stringArray(panel.tags)} onChange={v => update(index, 'tags', v)} />
          <Field label="Image URL" value={str(panel.image)} onChange={v => update(index, 'image', v)} />
          <Field label="Image alt text" value={str(panel.image_alt)} onChange={v => update(index, 'image_alt', v)} />
        </div>
      ))}
      {panels.length === 0 && <p className="text-xs text-gray-400">No panels yet.</p>}
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B] transition-colors bg-white"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </label>
  );
}
