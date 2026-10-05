import { Suspense, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import DeployStatus from './DeployStatus';

const navSections = [
  {
    heading: 'Content',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
      { to: '/admin/pages', label: 'Pages', icon: PagesIcon },
      { to: '/admin/services', label: 'Services', icon: ServicesIcon },
      { to: '/admin/media', label: 'Media Library', icon: MediaIcon },
    ],
  },
  {
    heading: 'Layout',
    items: [
      { to: '/admin/header', label: 'Header', icon: HeaderIcon },
      { to: '/admin/footer', label: 'Footer', icon: FooterIcon },
      { to: '/admin/navigation', label: 'Navigation', icon: NavIcon },
    ],
  },
  {
    heading: 'SEO & Tech',
    items: [
      { to: '/admin/seo', label: 'SEO Settings', icon: SeoIcon },
      { to: '/admin/redirects', label: 'Redirects', icon: RedirectIcon },
      { to: '/admin/scripts', label: 'Custom Scripts', icon: ScriptIcon },
      { to: '/admin/meta-tags', label: 'Meta Tags', icon: MetaIcon },
      { to: '/admin/custom-css', label: 'Custom CSS', icon: CssIcon },
    ],
  },
  {
    heading: 'System',
    items: [
      { to: '/admin/settings', label: 'Global Settings', icon: SettingsIcon },
      { to: '/admin/users', label: 'Users', icon: UsersIcon },
      { to: '/admin/history', label: 'Revision History', icon: HistoryIcon },
    ],
  },
];

export default function AdminLayout() {
  const { profile, role, session, signOut } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployState, setDeployState] = useState<'idle' | 'triggered' | 'failed'>('idle');

  async function handleGlobalDeploy() {
    if (!session?.access_token) {
      toast('Session expired — please log in again', 'error');
      return;
    }

    if (deploying) return;

    setDeploying(true);
    setDeployState('idle');

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json() as {
        success?: boolean;
        deploy?: 'triggered' | 'failed';
        message?: string;
        error?: string;
      };

      if (!res.ok || data.error || !data.success) {
        throw new Error(data.error ?? data.message ?? 'Deploy failed');
      }

      if (data.deploy === 'triggered') {
        setDeployState('triggered');
        toast(data.message ?? 'Vercel build triggered', 'success');
      } else {
        setDeployState('failed');
        toast(data.message ?? 'Deploy trigger failed', 'error');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deploy failed';
      setDeployState('failed');
      toast(message, 'error');
    } finally {
      setDeploying(false);
      window.setTimeout(() => setDeployState('idle'), 5000);
    }
  }

  async function handleSignOut() {
    await signOut();
    toast('Signed out successfully', 'info');
    navigate('/admin/login');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00AEEF] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-tight">Mateen CMS</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map(section => (
          <div key={section.heading}>
            <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              {section.heading}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#00AEEF]/15 text-[#00AEEF]'
                        : 'text-white/60 hover:text-white hover:bg-white/8'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#00AEEF]' : 'text-white/40'}`} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Global deploy action — available everywhere in the CMS */}
      <div className="flex-shrink-0 px-3 pb-3">
        <button
          type="button"
          onClick={handleGlobalDeploy}
          disabled={deploying}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all border ${
            deployState === 'triggered'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25'
              : deployState === 'failed'
                ? 'bg-red-500/15 text-red-300 border-red-400/25'
                : 'bg-[#00AEEF] text-white border-[#00AEEF] hover:bg-[#009bd6]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <svg className={`w-4 h-4 ${deploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {deploying
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
            }
          </svg>
          {deploying
            ? 'Deploying…'
            : deployState === 'triggered'
              ? 'Build Triggered ✓'
              : deployState === 'failed'
                ? 'Deploy Failed'
                : 'Deploy Changes'}
        </button>
        <p className="mt-1.5 px-1 text-[10px] leading-relaxed text-white/35">
          Save your changes first, then deploy to rebuild the public site.
        </p>
      </div>

      {/* Deploy status */}
      <Suspense fallback={null}>
        <DeployStatus />
      </Suspense>

      {/* User + sign out */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Public Site
        </a>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00AEEF]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#00AEEF] text-xs font-bold">
              {profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0) ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">
              {profile?.full_name ?? profile?.email ?? 'Admin'}
            </p>
            <p className="text-[10px] text-white/35 uppercase tracking-wider">
              {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col" style={{ background: '#071A2B' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-56 flex flex-col lg:hidden transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#071A2B' }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-[#071A2B] flex-1">Mateen CMS</span>
          <button
            type="button"
            onClick={handleGlobalDeploy}
            disabled={deploying}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              deployState === 'triggered'
                ? 'bg-emerald-100 text-emerald-700'
                : deployState === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-[#00AEEF] text-white hover:bg-[#009bd6]'
            } disabled:opacity-60`}
          >
            {deploying
              ? 'Deploying…'
              : deployState === 'triggered'
                ? 'Triggered ✓'
                : deployState === 'failed'
                  ? 'Failed'
                  : 'Deploy Changes'}
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function PagesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ServicesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function MediaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function HeaderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16" />
    </svg>
  );
}

function FooterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h16M4 18h16" />
    </svg>
  );
}

function NavIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
    </svg>
  );
}

function SeoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function RedirectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );
}

function ScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function CssIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}
