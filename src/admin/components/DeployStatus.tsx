import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { DeploymentLog } from '../types';

/**
 * Sidebar widget showing the most recent deploy status.
 * Polls the deployment_logs table every 30 seconds for a live view.
 */
export default function DeployStatus() {
  const [latest, setLatest] = useState<DeploymentLog | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchLatest() {
    const { data } = await supabase
      .from('deployment_logs')
      .select('*')
      .order('triggered_at', { ascending: false })
      .limit(1)
      .single();
    setLatest(data as DeploymentLog | null);
    setLoading(false);
  }

  useEffect(() => {
    fetchLatest();
    intervalRef.current = setInterval(fetchLatest, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) return null;

  const status = latest?.status;
  const action = latest?.action ?? 'publish';

  const icon = status === 'triggered'
    ? '✓'
    : status === 'failed'
    ? '✗'
    : status === 'pending'
    ? '…'
    : null;

  const colors: Record<string, string> = {
    triggered: 'text-emerald-400',
    failed:    'text-red-400',
    pending:   'text-amber-400',
  };

  const label: Record<string, string> = {
    triggered: 'Build triggered',
    failed:    'Deploy failed',
    pending:   'Publishing…',
  };

  if (!latest) {
    return (
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-white/30 uppercase tracking-wider">Deploy</p>
        <p className="text-[11px] text-white/40 mt-0.5">No deploys yet</p>
      </div>
    );
  }

  const timeAgo = formatTimeAgo(latest.triggered_at);

  return (
    <div className="px-4 py-3 border-t border-white/10">
      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Last Deploy</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-[11px] font-bold ${status ? colors[status] : 'text-white/40'}`}>
          {icon}
        </span>
        <span className={`text-[11px] ${status ? colors[status] : 'text-white/40'}`}>
          {status ? label[status] : '—'}
        </span>
      </div>
      <p className="text-[10px] text-white/30 mt-0.5 capitalize">{action} · {timeAgo}</p>
      {status === 'failed' && latest.error_message && (
        <p className="text-[10px] text-red-400/70 mt-1 truncate" title={latest.error_message}>
          {latest.error_message}
        </p>
      )}
    </div>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
