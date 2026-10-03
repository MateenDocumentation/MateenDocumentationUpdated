import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useAuditLog() {
  const { user } = useAuth();

  return useCallback(
    async (
      action: string,
      tableName?: string,
      recordId?: string,
      details?: Record<string, unknown>
    ) => {
      if (!user) return;
      try {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          user_email: user.email,
          action,
          table_name: tableName,
          record_id: recordId,
          details: details ?? null,
        });
      } catch {
        // Non-fatal — audit log failures must never break the main action
      }
    },
    [user]
  );
}
