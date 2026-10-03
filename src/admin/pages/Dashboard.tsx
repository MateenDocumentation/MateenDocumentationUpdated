import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Stats {
  pages: number;
  services: number;
  media: number;
  users: number;
}

export default function Dashboard() {
  const { profile, role } = useAuth();
  const [stats, setStats] = useState<Stats>({ pages: 0, services: 0, media: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [pages, services, media, users] = await Promise.all([
        supabase.from('pages').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('media_assets').select('id', { count: 'exact', head: true }),
        role === 'SUPER_ADMIN'
          ? supabase.from('profiles').select('id', { count: 'exact', head: true })
          : Promise.resolve({ count: null }),
      ]);
      setStats({
        pages: pages.count ?? 0,
        services: services.count ?? 0,
        media: media.count ?? 0,
        users: users.count ?? 0,
      });
      setLoading(false);
    }
    loadStats();
  }, [role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Pages', value: stats.pages, to: '/admin/pages', color: 'bg-blue-50 text-blue-700', icon: '📄' },
    { label: 'Services', value: stats.services, to: '/admin/services', color: 'bg-amber-50 text-amber-700', icon: '⚙️' },
    { label: 'Media Assets', value: stats.media, to: '/admin/media', color: 'bg-purple-50 text-purple-700', icon: '🖼️' },
    ...(role === 'SUPER_ADMIN' ? [{ label: 'Users', value: stats.users, to: '/admin/users', color: 'bg-emerald-50 text-emerald-700', icon: '👥' }] : []),
  ];

  const quickActions = [
    { label: 'Edit Header', to: '/admin/header', desc: 'Logo, navigation, phone, CTA' },
    { label: 'Edit Footer', to: '/admin/footer', desc: 'Links, contact info, social' },
    { label: 'Manage Pages', to: '/admin/pages', desc: 'Edit, publish, draft pages' },
    { label: 'Media Library', to: '/admin/media', desc: 'Upload and manage files' },
    { label: 'Services', to: '/admin/services', desc: 'Service listings and details' },
    { label: 'Global Settings', to: '/admin/settings', desc: 'Business name, contact info' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {profile?.full_name?.split(' ')[0] ?? 'Admin'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome to the Mateen Documentation CMS. Manage your website content below.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="h-8 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#071A2B]/20 hover:shadow-md transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{card.value}</p>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="flex flex-col gap-0.5 p-4 rounded-xl border border-gray-100 hover:border-[#00AEEF]/40 hover:bg-[#EEF7FF]/50 transition-all group"
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-[#071A2B]">
                {action.label}
              </span>
              <span className="text-xs text-gray-400">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* CMS Status */}
      <div className="mt-4 bg-emerald-50 rounded-2xl p-5 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">CMS is operational</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Phase 2 active — header, footer, pages, sections, media and services are fully manageable.
          </p>
        </div>
      </div>
    </div>
  );
}
