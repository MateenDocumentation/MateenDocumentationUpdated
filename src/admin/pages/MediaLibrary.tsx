import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import { useAuditLog } from '../hooks/useAuditLog';
import type { MediaAsset } from '../types';
import { EXISTING_WEBSITE_MEDIA } from '../mediaManifest';
import logoAsset from '../../assets/logo.webp';
import heroPosterAsset from '../../imports/mateen_hero_printer_poster.webp';
import heroVideoAsset from '../../imports/mateen_hero_printer_preview_16x9.mp4';

const BUCKET = 'cms-media';
const ACCEPT = 'image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/webm';

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getType(mime: string): MediaAsset['type'] {
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'image/svg+xml') return 'svg';
  return 'image';
}

function isCmsStorageUrl(url: string) {
  return url.includes('/storage/v1/object/public/cms-media/');
}

function looksLikeExternalMedia(url: string, key = '') {
  if (!/^https?:\/\//i.test(url) || isCmsStorageUrl(url)) return false;
  const hint = key.toLowerCase();
  return /image|img|video|poster|logo|favicon|photo|media/.test(hint)
    || /images\.unsplash\.com/i.test(url)
    || /\.(?:jpe?g|png|webp|svg|mp4|webm)(?:[?#].*)?$/i.test(url);
}

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-');
}

function extensionFromMime(mime: string) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/svg+xml') return 'svg';
  if (mime === 'video/mp4') return 'mp4';
  if (mime === 'video/webm') return 'webm';
  return 'bin';
}

export default function MediaLibrary() {
  const toast = useToast();
  const auditLog = useAuditLog();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importingExisting, setImportingExisting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
    setAssets(data ?? []);
    setLoading(false);
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type,
      });

      if (upErr) {
        toast(`Upload failed: ${upErr.message}`, 'error');
        continue;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      let width: number | undefined;
      let height: number | undefined;
      if (file.type.startsWith('image/')) {
        const dims = await getImageDimensions(file);
        width = dims.width;
        height = dims.height;
      }

      const { data: assetData, error: dbErr } = await supabase.from('media_assets').insert({
        filename: file.name,
        storage_path: path,
        public_url: urlData.publicUrl,
        type: getType(file.type),
        mime_type: file.type,
        size_bytes: file.size,
        width,
        height,
        alt_text: '',
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      }).select().single();

      if (dbErr) {
        toast(`DB error: ${dbErr.message}`, 'error');
      } else if (assetData) {
        setAssets(prev => [assetData, ...prev]);
      }
    }

    setUploading(false);
    await auditLog('media_upload', 'media_assets');
    toast('Upload complete');
  }

  async function importOneUrl(sourceUrl: string, preferredFilename: string, title: string, sourceKey = sourceUrl): Promise<MediaAsset | null> {
    const { data: existing } = await supabase
      .from('media_assets')
      .select('*')
      .eq('source_url', sourceKey)
      .maybeSingle();

    if (existing) return existing as MediaAsset;

    const response = await fetch(sourceUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not download ${preferredFilename} (${response.status})`);

    const blob = await response.blob();
    const mime = blob.type || (preferredFilename.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg');
    const rawBase = preferredFilename.replace(/\.[^.]+$/, '');
    const filename = `${safeFilename(rawBase)}.${extensionFromMime(mime)}`;
    const storagePath = `website-import/${filename}`;

    let uploadError: { message: string } | null = null;
    const uploaded = await supabase.storage.from(BUCKET).upload(storagePath, blob, {
      cacheControl: '31536000',
      contentType: mime,
      upsert: false,
    });
    uploadError = uploaded.error;

    if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) {
      throw new Error(`Storage upload failed for ${filename}: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    let width: number | undefined;
    let height: number | undefined;
    if (mime.startsWith('image/')) {
      const file = new File([blob], filename, { type: mime });
      const dims = await getImageDimensions(file);
      width = dims.width || undefined;
      height = dims.height || undefined;
    }

    const { data: assetData, error: dbErr } = await supabase.from('media_assets').insert({
      filename,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      source_url: sourceKey,
      type: getType(mime),
      mime_type: mime,
      size_bytes: blob.size,
      width,
      height,
      alt_text: '',
      title,
    }).select().single();

    if (dbErr) {
      // Another import may have inserted it while we were downloading.
      const { data: retry } = await supabase.from('media_assets').select('*').eq('source_url', sourceKey).maybeSingle();
      if (retry) return retry as MediaAsset;
      throw new Error(`Media database insert failed for ${filename}: ${dbErr.message}`);
    }

    return assetData as MediaAsset;
  }

  function collectMediaUrls(value: unknown, keyHint = '', output = new Set<string>()): Set<string> {
    if (typeof value === 'string') {
      if (looksLikeExternalMedia(value, keyHint)) output.add(value);
      return output;
    }
    if (Array.isArray(value)) {
      value.forEach(item => collectMediaUrls(item, keyHint, output));
      return output;
    }
    if (value && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => collectMediaUrls(child, key, output));
    }
    return output;
  }

  function replaceMediaUrls(value: unknown, urlMap: Map<string, string>, keyHint = ''): unknown {
    if (typeof value === 'string') {
      return looksLikeExternalMedia(value, keyHint) ? (urlMap.get(value) ?? value) : value;
    }
    if (Array.isArray(value)) return value.map(item => replaceMediaUrls(item, urlMap, keyHint));
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, replaceMediaUrls(child, urlMap, key)])
      );
    }
    return value;
  }

  async function importExistingWebsiteMedia() {
    if (importingExisting) return;
    const ok = confirm(
      'Import all media currently used by the website into the CMS Media Library?\n\n' +
      'This copies existing website images/video into Supabase Storage and reconnects CMS media fields. It does not delete your current files.'
    );
    if (!ok) return;

    setImportingExisting(true);
    setImportProgress('Preparing import…');

    const urlMap = new Map<string, string>();
    const failures: string[] = [];
    let importedCount = 0;
    let reusedCount = 0;

    async function safeImport(
      sourceUrl: string,
      preferredFilename: string,
      title: string,
      sourceKey = sourceUrl
    ): Promise<MediaAsset | null> {
      try {
        const { data: existing } = await supabase
          .from('media_assets')
          .select('*')
          .eq('source_url', sourceKey)
          .maybeSingle();

        if (existing) {
          reusedCount += 1;
          return existing as MediaAsset;
        }

        const asset = await importOneUrl(sourceUrl, preferredFilename, title, sourceKey);
        if (asset) importedCount += 1;
        return asset;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[media-import] skipped:', sourceKey, error);
        failures.push(`${preferredFilename}: ${message}`);
        return null;
      }
    }

    try {
      // 1) Static website image URLs from the source code.
      for (let i = 0; i < EXISTING_WEBSITE_MEDIA.length; i += 1) {
        const item = EXISTING_WEBSITE_MEDIA[i];
        setImportProgress(`Importing website image ${i + 1}/${EXISTING_WEBSITE_MEDIA.length}`);
        const asset = await safeImport(item.sourceUrl, item.filename, item.title);
        if (asset) urlMap.set(item.sourceUrl, asset.public_url);
      }

      // 2) Current service images from Supabase, including any URLs not in source code.
      setImportProgress('Importing service images…');
      const { data: services, error: servicesError } = await supabase.from('services').select('id,slug,title,image_url');
      if (servicesError) throw servicesError;
      for (const service of services ?? []) {
        const source = service.image_url as string | null;
        if (!source || !looksLikeExternalMedia(source, 'image_url')) continue;
        const asset = await safeImport(source, `service-${service.slug}.jpg`, `${service.title} — service image`);
        if (asset) {
          urlMap.set(source, asset.public_url);
          const { error } = await supabase
            .from('services')
            .update({ image_url: asset.public_url, updated_at: new Date().toISOString() })
            .eq('id', service.id);
          if (error) failures.push(`service ${service.slug}: ${error.message}`);
        }
      }

      // 3) Media URLs already stored inside page section JSON.
      setImportProgress('Importing page-section media…');
      const { data: sections, error: sectionsError } = await supabase.from('page_sections').select('id,content');
      if (sectionsError) throw sectionsError;
      for (const section of sections ?? []) {
        const urls = Array.from(collectMediaUrls(section.content));
        for (const source of urls) {
          let publicUrl = urlMap.get(source);
          if (!publicUrl) {
            const asset = await safeImport(
              source,
              `section-${section.id}-${Math.random().toString(36).slice(2, 8)}.jpg`,
              'CMS section media'
            );
            publicUrl = asset?.public_url;
            if (publicUrl) urlMap.set(source, publicUrl);
          }
        }
        const updatedContent = replaceMediaUrls(section.content, urlMap);
        const { error } = await supabase
          .from('page_sections')
          .update({ content: updatedContent, updated_at: new Date().toISOString() })
          .eq('id', section.id);
        if (error) failures.push(`page section ${section.id}: ${error.message}`);
      }

      // 4) Built-in local media: logo, favicon, hero poster, hero video.
      setImportProgress('Importing logo, favicon and hero video…');
      const logo = await safeImport(logoAsset, 'mateen-logo.webp', 'Mateen Documentation logo', 'builtin://mateen-logo');
      const favicon = await safeImport('/favicon.png', 'mateen-favicon.png', 'Mateen Documentation favicon', 'builtin://mateen-favicon');
      const heroPoster = await safeImport(heroPosterAsset, 'home-hero-poster.webp', 'Home hero video poster', 'builtin://home-hero-poster');
      const heroVideo = await safeImport(heroVideoAsset, 'home-hero-video.mp4', 'Home hero video', 'builtin://home-hero-video');

      if (logo || favicon) {
        const siteUpdate: Record<string, string> = {};
        if (logo) siteUpdate.logo_url = logo.public_url;
        if (favicon) siteUpdate.favicon_url = favicon.public_url;
        const { error } = await supabase.from('site_settings').update(siteUpdate).eq('id', '1');
        if (error) failures.push(`site settings: ${error.message}`);
      }
      if (logo) {
        const { error } = await supabase.from('header_settings').update({ logo_url: logo.public_url }).eq('id', '1');
        if (error) failures.push(`header logo: ${error.message}`);
      }

      // 5) Connect imported hero poster/video to the Home hero CMS section.
      if (heroPoster || heroVideo) {
        const { data: homePage } = await supabase.from('pages').select('id').eq('slug', '/').maybeSingle();
        if (homePage?.id) {
          const { data: heroRow } = await supabase
            .from('page_sections')
            .select('id,content')
            .eq('page_id', homePage.id)
            .eq('type', 'hero')
            .maybeSingle();
          if (heroRow?.id) {
            const content = { ...(heroRow.content ?? {}) } as Record<string, unknown>;
            if (heroVideo) content.video_url = heroVideo.public_url;
            if (heroPoster) {
              content.video_poster = heroPoster.public_url;
              content.image_url = heroPoster.public_url;
            }
            const { error } = await supabase
              .from('page_sections')
              .update({ content, updated_at: new Date().toISOString() })
              .eq('id', heroRow.id);
            if (error) failures.push(`home hero media: ${error.message}`);
          }
        }
      }

      await auditLog('media_import_existing_site', 'media_assets', undefined, {
        mapped_source_count: urlMap.size,
        imported_count: importedCount,
        reused_count: reusedCount,
        failed_count: failures.length,
      });
      await loadAssets();

      if (failures.length > 0) {
        setImportProgress(`Import finished with ${failures.length} skipped item${failures.length === 1 ? '' : 's'}.`);
        toast(`Media import finished. ${failures.length} item(s) were skipped; successful items are already linked.`, 'info');
      } else {
        setImportProgress(`Import complete — ${importedCount} imported, ${reusedCount} already present.`);
        toast('Existing website media imported and linked. Click Deploy Changes to publish it.', 'success');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Media import failed';
      console.error('[media-import]', error);
      setImportProgress('Import failed');
      toast(message, 'error');
    } finally {
      setImportingExisting(false);
    }
  }

  async function deleteAsset(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.filename}"? This cannot be undone.`)) return;
    await supabase.storage.from(BUCKET).remove([asset.storage_path]);
    await supabase.from('media_assets').delete().eq('id', asset.id);
    await auditLog('media_delete', 'media_assets', asset.id, { filename: asset.filename, type: asset.type });
    setAssets(prev => prev.filter(a => a.id !== asset.id));
    if (selected?.id === asset.id) setSelected(null);
    toast('Asset deleted');
  }

  async function saveAssetMeta() {
    if (!selected) return;
    const { error } = await supabase.from('media_assets').update({ alt_text: editAlt, title: editTitle }).eq('id', selected.id);
    if (error) { toast('Save failed', 'error'); return; }
    setAssets(prev => prev.map(a => a.id === selected.id ? { ...a, alt_text: editAlt, title: editTitle } : a));
    setSelected(prev => prev ? { ...prev, alt_text: editAlt, title: editTitle } : null);
    toast('Metadata saved');
  }

  function openDetail(asset: MediaAsset) {
    setSelected(asset);
    setEditAlt(asset.alt_text ?? '');
    setEditTitle(asset.title ?? '');
  }

  const filtered = assets.filter(a =>
    !search || a.filename.toLowerCase().includes(search.toLowerCase()) || (a.title ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-400 mt-1">Upload and manage images, videos, and documents</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 focus:border-[#071A2B]"
          />
          <button
            onClick={importExistingWebsiteMedia}
            disabled={importingExisting || uploading}
            className="px-4 py-2 bg-[#00AEEF] text-[#071A2B] text-sm font-bold rounded-xl hover:bg-[#20baf0] disabled:opacity-60 transition-colors flex items-center gap-2"
            title="One-time import of media currently used by the website"
          >
            {importingExisting ? (
              <><div className="w-4 h-4 border-2 border-[#071A2B]/25 border-t-[#071A2B] rounded-full animate-spin" /> Importing…</>
            ) : (
              <>Import Website Media</>
            )}
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading || importingExisting}
            className="px-4 py-2 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload</>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
        </div>
      </div>

      {importProgress && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-xs font-semibold ${importProgress === 'Import failed' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-[#EEF7FF] border-[#00AEEF]/20 text-[#071A2B]'}`}>
          {importProgress}
        </div>
      )}

      {/* Drop zone hint */}
      <div
        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-6 text-center cursor-pointer hover:border-[#00AEEF]/50 hover:bg-[#EEF7FF]/30 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
      >
        <p className="text-sm text-gray-400">Drag & drop files here, or <span className="text-[#071A2B] font-semibold">browse</span></p>
        <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP, SVG, MP4, WEBM</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No media found. Upload your first file above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filtered.map(asset => (
              <div
                key={asset.id}
                onClick={() => openDetail(asset)}
                className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === asset.id ? 'border-[#00AEEF] ring-2 ring-[#00AEEF]/30' : 'border-gray-100'
                }`}
              >
                {asset.type === 'image' || asset.type === 'svg' ? (
                  <img
                    src={asset.public_url}
                    alt={asset.alt_text ?? asset.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] font-medium truncate">{asset.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-40">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Asset Details</h3>
            <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Preview */}
            <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100">
              {selected.type === 'image' || selected.type === 'svg' ? (
                <img src={selected.public_url} alt={selected.alt_text ?? ''} className="w-full h-full object-contain" />
              ) : (
                <video src={selected.public_url} controls className="w-full h-full" />
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-1 text-xs text-gray-500 mb-4">
              <p><span className="font-semibold">File:</span> {selected.filename}</p>
              <p><span className="font-semibold">Type:</span> {selected.mime_type}</p>
              <p><span className="font-semibold">Size:</span> {formatBytes(selected.size_bytes)}</p>
              {selected.width && <p><span className="font-semibold">Dimensions:</span> {selected.width} × {selected.height}px</p>}
              <p><span className="font-semibold">Uploaded:</span> {new Date(selected.created_at).toLocaleDateString()}</p>
            </div>

            {/* URL copy */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Public URL</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={selected.public_url}
                  className="flex-1 px-2.5 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50"
                />
                <button
                  onClick={() => { navigator.clipboard.writeText(selected.public_url); toast('URL copied'); }}
                  className="px-2.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Edit */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alt text</label>
                <textarea
                  value={editAlt}
                  onChange={e => setEditAlt(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={saveAssetMeta}
              className="flex-1 py-2 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => deleteAsset(selected)}
              className="px-3 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}
