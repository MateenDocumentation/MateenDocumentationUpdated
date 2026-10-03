import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useAuditLog } from '../hooks/useAuditLog';
import type { Profile, UserRole } from '../types';

export default function Users() {
  const { profile: currentUser } = useAuth();
  const toast = useToast();
  const auditLog = useAuditLog();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('EDITOR');
  const [inviteName, setInviteName] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at').then(({ data }) => {
      setUsers(data ?? []);
      setLoading(false);
    });
  }, []);

  async function changeRole(user: Profile, role: UserRole) {
    if (user.id === currentUser?.id && role !== 'SUPER_ADMIN') {
      toast('Cannot demote yourself', 'error');
      return;
    }
    const { error } = await supabase.from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (error) { toast('Failed to change role', 'error'); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u));
    await auditLog('user_role_change', 'profiles', user.id, { email: user.email, previous_role: user.role, new_role: role });
    toast('Role updated');
  }

  const roleBadge = (role: UserRole) =>
    role === 'SUPER_ADMIN'
      ? 'bg-[#071A2B] text-white'
      : 'bg-gray-100 text-gray-700';

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage CMS users and roles</p>
        </div>
        <button
          onClick={() => setInviting(true)}
          className="px-4 py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] transition-colors"
        >
          Invite User
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-3xl">
        <p className="text-xs text-amber-800 font-semibold">Note: User invitations are handled through the Supabase dashboard. Use <code className="bg-amber-100 px-1 rounded">Authentication → Invite user</code> in Supabase, then set their role in this table.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">User</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Role</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3.5">Joined</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3.5">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EEF7FF] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#071A2B] text-xs font-bold">
                          {user.full_name?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.full_name ?? '—'}
                          {user.id === currentUser?.id && <span className="ml-1.5 text-[10px] text-gray-400">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleBadge(user.role)}`}>
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user, e.target.value as UserRole)}
                      disabled={user.id === currentUser?.id && user.role === 'SUPER_ADMIN'}
                      className="text-xs font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#071A2B]/15 disabled:opacity-40"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role reference */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 max-w-3xl">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Role Permissions</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-[#071A2B] mb-2">SUPER_ADMIN</p>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Full CMS access</li>
              <li>✅ Manage users and roles</li>
              <li>✅ Modify system configuration</li>
              <li>✅ Inject custom scripts</li>
              <li>✅ Manage security settings</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-600 mb-2">EDITOR</p>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Edit content and media</li>
              <li>✅ Manage pages and sections</li>
              <li>✅ Manage services</li>
              <li>❌ Cannot manage users</li>
              <li>❌ Cannot inject scripts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite modal (informational) */}
      {inviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Invite User</h2>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-blue-800">
                To invite users, go to your <strong>Supabase Dashboard → Authentication → Users → Invite user</strong>.
                After they set their password, their profile will appear here automatically. Then set their role below.
              </p>
            </div>
            <button
              onClick={() => setInviting(false)}
              className="w-full py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
