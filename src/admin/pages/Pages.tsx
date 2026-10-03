import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useAuditLog } from '../hooks/useAuditLog';
import { useVersionHistory } from '../hooks/useVersionHistory';
import type { Page, PageStatus, PublishResult } from '../types';

// ─── Publish API call ─────────────────────────────────────────────────────────

async function callPublishApi(
  pageId: string,
  pageSlug: string,
  action: 'publish' | 'unpublish',
  accessToken: string
): Promise<PublishResult> {
  const res = await fetch('/api/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ page_id: pageId, page_slug: pageSlug, action }),
  });
  const data = await res.json() as PublishResult & { error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? 'Publish failed');
  }
  return data;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PageStatus }) {
  const cfg: Record<PageStatus, { label: string; cls: string; dot: string }> = {
    published:   { label: 'Published',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500' },
    draft:       { label: 'Draft',       cls: 'bg-amber-50 text-amber-700 border-amber-200',        dot: 'bg-amber-400' },
    unpublished: { label: 'Unpublished', cls: 'bg-gray-100 text-gray-500 border-gray-200',          dot: 'bg-gray-400' },
  };
  const { label, cls, dot } = cfg[status] ?? cfg.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ─── Deploy status pill ───────────────────────────────────────────────────────

type DeployState = 'idle' | 'publishing' | 'published' | 'failed';

function DeployPill({ state, message }: { state: DeployState; message?: string }) {
  if (state === 'idle') return null;
  const cfg: Record<string, { cls: string; label: string }> = {
    publishing: { cls: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse', label: 'Publishing…' },
    published:  { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',       label: 'Live ✓' },
    failed:     { cls: 'bg-red-50 text-red-700 border-red-200',                   label: 'Deploy failed' },
  };
  const { cls, label } = cfg[state] ?? cfg.publishing;
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cls}`} title={message}>
      {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Pages() {
  const toast = useToast();
  const { session } = useAuth();
  const auditLog = useAuditLog();
  const recordVersion = useVersionHistory();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployStates, setDeployStates] = useState<Record<string, { state: DeployState; message?: string }>>({});
  const [confirmModal, setConfirmModal] = useState<{
    page: Page;
    action: 'publish' | 'unpublish';
  } | null>(null);

  // Duplicate modal
  const [duplicating, setDuplicating] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('pages')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setPages((data ?? []) as Page[]);
        setLoading(false);
      });
  }, []);

  function setDeploy(pageId: string, state: DeployState, message?: string) {
    setDeployStates(prev => ({ ...prev, [pageId]: { state, message } }));
  }

  // ── Publish / Unpublish ─────────────────────────────────────────────────────

  async function handlePublishAction(page: Page, action: 'publish' | 'unpublish') {
    if (!session?.access_token) {
      toast('Session expired — please log in again', 'error');
      return;
    }

    setConfirmModal(null);
    setDeploy(page.id, 'publishing');

    // Record version snapshot BEFORE the change
    await recordVersion(
      'pages',
      page.id,
      page as unknown as Record<string, unknown>,
      { ...page, status: action === 'publish' ? 'published' : 'unpublished' } as unknown as Record<string, unknown>,
      action
    );

    try {
      const result = await callPublishApi(page.id, page.slug, action, session.access_token);

      // Update local state
      setPages(prev =>
        prev.map(p =>
          p.id === page.id
            ? { ...p, status: result.new_status }
            : p
        )
      );

      if (result.deploy === 'triggered') {
        setDeploy(page.id, 'published', result.message);
        toast(result.message, 'success');
      } else if (result.deploy === 'failed') {
        setDeploy(page.id, 'failed', result.message);
        toast(result.message, 'error');
      } else {
        setDeploy(page.id, 'idle');
        toast(result.message);
      }

      await auditLog(
        `${action}_page`,
        'pages',
        page.id,
        { slug: page.slug, deploy: result.deploy }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      setDeploy(page.id, 'failed', msg);
      toast(msg, 'error');
    }
  }

  // ── Duplicate ───────────────────────────────────────────────────────────────

  async function handleDuplicate(page: Page) {
    setDuplicating(page.id);

    const newSlug = page.slug + '-copy-' + Date.now().toString(36);
    const { data, error } = await supabase
      .from('pages')
      .insert({
        name: page.name + ' (Copy)',
        slug: newSlug,
        status: 'draft',
        is_protected: false,
      })
      .select()
      .single();

    if (error) {
      toast('Duplicate failed: ' + error.message, 'error');
      setDuplicating(null);
      return;
    }

    // Duplicate sections
    const { data: sections } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', page.id);

    if (sections && sections.length > 0) {
      await supabase.from('page_sections').insert(
        sections.map(({ id: _id, page_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
          ...rest,
          page_id: (data as Page).id,
        }))
      );
    }

    setPages(prev => [...prev, data as Page].sort((a, b) => a.name.localeCompare(b.name)));
    await auditLog('duplicate_page', 'pages', (data as Page).id, { source_id: page.id });
    toast(`Duplicated as draft: ${(data as Page).name}`);
    setDuplicating(null);
  }

  // ── Status filter tabs ───────────────────────────────────────────────────────

  const [filter, setFilter] = useState<'all' | PageStatus>('all');
  const filtered = pages.filter(p => filter === 'all' || p.status === filter);

  const counts: Record<PageStatus | 'all', number> = {
    all: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    unpublished: pages.filter(p => p.status === 'unpublished').length,
  };

  const filterTabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Draft' },
    { key: 'unpublished', label: 'Unpublished' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage page publishing. Editing sections does not auto-publish changes.
          </p>
        </div>
      </div>

      {/* Publishing workflow note */}
      <div className="flex items-start gap-3 bg-[#EEF7FF] border border-[#00AEEF]/30 rounded-xl px-4 py-3 mb-6">
        <svg className="w-4 h-4 text-[#00AEEF] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-[#071A2B]">Publish Workflow</p>
          <p className="text-xs text-gray-600 mt-0.5">
            <strong>Draft</strong> — work in progress, not visible to the public.
            <strong className="ml-1.5">Published</strong> — live on the public site after a Vercel build.
            <strong className="ml-1.5">Unpublished</strong> — removed from public view, content preserved.
            Editing sections never triggers an automatic publish.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {filterTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === t.key
                ? 'bg-[#071A2B] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-60">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">Name</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-36">Status</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5 w-40 hidden md:table-cell">Last Modified</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                    No pages in this filter.
                  </td>
                </tr>
              ) : filtered.map(page => {
                const deploy = deployStates[page.id];
                return (
                  <tr key={page.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{page.name}</p>
                          <code className="text-[11px] text-gray-400">{page.slug}</code>
                        </div>
                        {deploy && <DeployPill state={deploy.state} message={deploy.message} />}
                        {page.is_protected && (
                          <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded border border-gray-200">Protected</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={page.status} />
                      {page.published_at && page.status === 'published' && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(page.published_at).toLocaleDateString('en-PK')}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-xs text-gray-500">
                        {new Date(page.last_edited_at ?? page.updated_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Edit Sections */}
                        <Link
                          to={`/admin/pages/${page.id}`}
                          className="text-xs font-semibold text-[#071A2B] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Edit Sections
                        </Link>

                        {/* Preview (draft/unpublished) */}
                        {page.status !== 'published' && (
                          <Link
                            to={`/admin/preview/${page.id}`}
                            className="text-xs font-semibold text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Preview
                          </Link>
                        )}

                        {/* Publish / Unpublish */}
                        {page.status !== 'published' ? (
                          <button
                            onClick={() => setConfirmModal({ page, action: 'publish' })}
                            disabled={!!deployStates[page.id]?.state && deployStates[page.id].state === 'publishing'}
                            className="text-xs font-semibold text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ page, action: 'unpublish' })}
                            disabled={!!deployStates[page.id]?.state && deployStates[page.id].state === 'publishing'}
                            className="text-xs font-semibold text-amber-700 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 disabled:opacity-60 transition-colors"
                          >
                            Unpublish
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(page)}
                          disabled={duplicating === page.id}
                          className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
                        >
                          {duplicating === page.id ? '…' : 'Duplicate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {confirmModal.action === 'publish' ? 'Publish page?' : 'Unpublish page?'}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              <strong className="text-gray-800">{confirmModal.page.name}</strong>
            </p>
            {confirmModal.action === 'publish' ? (
              <p className="text-sm text-gray-500 mb-5">
                This will trigger a Vercel build. The page will be live within ~60 seconds.
                All current section content will be published as-is.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-5">
                The page will be marked unpublished in the CMS. The current live build
                will remain online until a new deploy is triggered. Unpublishing does not
                delete content.
              </p>
            )}

            {confirmModal.action === 'publish' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Only the sections you have explicitly saved will be
                  published. Unsaved edits in the section editor will not be included.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublishAction(confirmModal.page, confirmModal.action)}
                className={`px-5 py-2 text-sm font-bold text-white rounded-xl transition-colors ${
                  confirmModal.action === 'publish'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmModal.action === 'publish' ? 'Publish & Deploy' : 'Unpublish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
