import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { applyRollback } from '../hooks/useVersionHistory';
import type { AuditLog, ContentVersion } from '../types';

type TabKey = 'audit' | 'versions';

const ACTION_COLORS: Record<string, string> = {
  login:            'bg-blue-50 text-blue-700',
  logout:           'bg-gray-100 text-gray-500',
  edit:             'bg-amber-50 text-amber-700',
  publish_page:     'bg-emerald-50 text-emerald-700',
  unpublish_page:   'bg-amber-50 text-amber-700',
  duplicate_page:   'bg-blue-50 text-blue-700',
  rollback:         'bg-purple-50 text-purple-700',
  media_delete:     'bg-red-50 text-red-700',
  seo_save:         'bg-cyan-50 text-cyan-700',
  script_save:      'bg-cyan-50 text-cyan-700',
  user_role_change: 'bg-orange-50 text-orange-700',
};

function actionColor(action: string): string {
  return ACTION_COLORS[action] ?? 'bg-gray-50 text-gray-600';
}

function timeStr(iso: string): string {
  return new Date(iso).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// ─── Audit Log tab ────────────────────────────────────────────────────────────

function AuditLogTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  useEffect(() => {
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      .then(({ data }) => {
        setLogs(prev => page === 0 ? (data ?? []) as AuditLog[] : [...prev, ...(data ?? []) as AuditLog[]]);
        setLoading(false);
      });
  }, [page]);

  return (
    <div>
      {loading && page === 0 ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">No audit log entries yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Action</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">User</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Table / Record</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 w-44">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${actionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-xs text-gray-600 truncate max-w-[180px]">{log.user_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {log.table_name && (
                      <code className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {log.table_name}
                        {log.record_id && <span className="text-gray-400"> #{log.record_id.slice(0, 6)}</span>}
                      </code>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-gray-400">{timeStr(log.created_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {logs.length > 0 && logs.length % PAGE_SIZE === 0 && (
        <div className="p-4 text-center border-t border-gray-50">
          <button
            onClick={() => setPage(p => p + 1)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Content Versions tab ─────────────────────────────────────────────────────

function VersionsTab() {
  const toast = useToast();
  const { role, user } = useAuth();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rolling, setRolling] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const query = supabase
      .from('content_versions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (tableFilter) query.eq('table_name', tableFilter);

    query.then(({ data }) => {
      setVersions(prev =>
        page === 0
          ? (data ?? []) as ContentVersion[]
          : [...prev, ...(data ?? []) as ContentVersion[]]
      );
      setLoading(false);
    });
  }, [page, tableFilter]);

  async function handleRollback(v: ContentVersion) {
    if (!user) return;
    if (!confirm(`Roll back this ${v.table_name} record to the snapshot from ${timeStr(v.created_at)}? This will overwrite current values.`)) return;

    setRolling(v.id);
    const { error } = await applyRollback(
      v.table_name,
      v.record_id,
      v.snapshot,
      v.id,
      user.id,
      user.email ?? ''
    );
    setRolling(null);

    if (error) {
      toast('Rollback failed: ' + error, 'error');
      return;
    }

    toast('Rolled back successfully. Publish the page to reflect on the live site.');
  }

  const TABLE_OPTIONS = ['pages', 'page_sections', 'seo_settings', 'services', 'header_settings', 'footer_settings'];

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <label className="text-xs font-semibold text-gray-500">Filter by table:</label>
        <select
          value={tableFilter}
          onChange={e => { setTableFilter(e.target.value); setPage(0); setVersions([]); }}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15"
        >
          <option value="">All tables</option>
          {TABLE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {!isSuperAdmin && (
        <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-100 px-5 py-2.5">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-700">Rollback requires SUPER_ADMIN access. You can view version history but not restore.</p>
        </div>
      )}

      {loading && page === 0 ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">No content versions recorded yet.</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {versions.map(v => (
            <div key={v.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <code className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{v.table_name}</code>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${actionColor(v.action)}`}>
                      {v.action}
                    </span>
                    {v.rollback_of && (
                      <span className="text-[10px] text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                        rollback
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{timeStr(v.created_at)}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50"
                  >
                    {expanded === v.id ? 'Hide diff' : 'View diff'}
                  </button>

                  {isSuperAdmin && v.action !== 'rollback' && (
                    <button
                      onClick={() => handleRollback(v)}
                      disabled={rolling === v.id}
                      className="text-xs font-semibold text-white bg-purple-600 px-3 py-1 rounded-lg hover:bg-purple-700 disabled:opacity-60 transition-colors"
                    >
                      {rolling === v.id ? 'Rolling back…' : 'Rollback'}
                    </button>
                  )}
                </div>
              </div>

              {/* Diff viewer */}
              {expanded === v.id && (
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Before</p>
                    <pre className="text-[10px] bg-red-50 border border-red-100 rounded-xl p-3 overflow-auto max-h-60 leading-relaxed text-red-900 font-mono whitespace-pre-wrap">
                      {JSON.stringify(v.snapshot, null, 2)}
                    </pre>
                  </div>
                  {v.new_snapshot && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">After</p>
                      <pre className="text-[10px] bg-emerald-50 border border-emerald-100 rounded-xl p-3 overflow-auto max-h-60 leading-relaxed text-emerald-900 font-mono whitespace-pre-wrap">
                        {JSON.stringify(v.new_snapshot, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {versions.length > 0 && versions.length % PAGE_SIZE === 0 && (
        <div className="p-4 text-center border-t border-gray-50">
          <button onClick={() => setPage(p => p + 1)} className="text-xs font-semibold text-gray-500 hover:text-gray-700">
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RevisionHistory() {
  const [tab, setTab] = useState<TabKey>('audit');

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Revision History</h1>
        <p className="text-sm text-gray-400 mt-1">Audit trail of all CMS actions + content version snapshots with SUPER_ADMIN rollback</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100">
          {([
            { key: 'audit' as TabKey, label: 'Audit Log' },
            { key: 'versions' as TabKey, label: 'Content Versions' },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${
                tab === t.key
                  ? 'text-[#071A2B] border-[#071A2B]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'audit' ? <AuditLogTab /> : <VersionsTab />}
      </div>
    </div>
  );
}
