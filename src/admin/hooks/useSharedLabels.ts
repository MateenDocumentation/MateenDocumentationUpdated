import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

export type SharedLabelItem = { key: string; value: string };

export function useSharedLabels() {
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [items, setItems] = useState<SharedLabelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', '/shared')
        .maybeSingle();

      if (!page?.id) {
        setLoading(false);
        return;
      }

      const { data: section } = await supabase
        .from('page_sections')
        .select('id, content')
        .eq('page_id', page.id)
        .eq('type', 'shared_labels')
        .maybeSingle();

      if (section?.id) {
        setSectionId(section.id);
        const rawItems = Array.isArray(section.content?.items) ? section.content.items : [];
        setItems(rawItems.filter((item: any) => item && typeof item.key === 'string').map((item: any) => ({
          key: String(item.key),
          value: String(item.value ?? ''),
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const values = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of items) map[item.key] = item.value;
    return map;
  }, [items]);

  function getLabel(key: string, fallback = '') {
    return values[key] ?? fallback;
  }

  function setLabel(key: string, value: string) {
    setItems(prev => {
      const found = prev.some(item => item.key === key);
      if (found) return prev.map(item => item.key === key ? { ...item, value } : item);
      return [...prev, { key, value }];
    });
  }

  async function saveLabels() {
    if (!sectionId) throw new Error('Shared Website Labels section not found.');
    const { error } = await supabase
      .from('page_sections')
      .update({
        content: { items },
        updated_at: new Date().toISOString(),
      })
      .eq('id', sectionId);
    if (error) throw error;
  }

  return { loading, items, getLabel, setLabel, saveLabels };
}
