import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Records a content version snapshot BEFORE a save.
 * Pass the current (pre-save) state as `previousValues` and the incoming
 * state as `newValues`. The snapshot stored is the previous state so that
 * SUPER_ADMIN can restore it to roll back.
 */
export function useVersionHistory() {
  const { user } = useAuth();

  return useCallback(
    async (
      tableName: string,
      recordId: string,
      previousValues: Record<string, unknown>,
      newValues: Record<string, unknown>,
      action = 'edit'
    ) => {
      if (!user) return;
      try {
        await supabase.from('content_versions').insert({
          table_name: tableName,
          record_id: recordId,
          snapshot: previousValues,
          new_snapshot: newValues,
          changed_by: user.id,
          action,
        });
      } catch {
        // Non-fatal
      }
    },
    [user]
  );
}

/**
 * Rolls back a record to the snapshot stored in a ContentVersion row.
 * Only SUPER_ADMIN should call this.
 */
export async function applyRollback(
  tableName: string,
  recordId: string,
  snapshot: Record<string, unknown>,
  versionId: string,
  userId: string,
  userEmail: string
): Promise<{ error?: string }> {
  // Strip version-tracking fields from the snapshot before applying
  const { id: _id, created_at: _ca, updated_at: _ua, ...restorable } = snapshot as Record<string, unknown>;
  void _id; void _ca; void _ua;

  const { error } = await supabase
    .from(tableName)
    .update({ ...restorable, updated_at: new Date().toISOString() })
    .eq('id', recordId);

  if (error) return { error: error.message };

  // Record the rollback as a new version entry
  await supabase.from('content_versions').insert({
    table_name: tableName,
    record_id: recordId,
    snapshot: restorable,
    new_snapshot: restorable,
    changed_by: userId,
    action: 'rollback',
    rollback_of: versionId,
  });

  // Audit
  await supabase.from('audit_logs').insert({
    user_id: userId,
    user_email: userEmail,
    action: 'rollback',
    table_name: tableName,
    record_id: recordId,
    details: { version_id: versionId },
  });

  return {};
}
