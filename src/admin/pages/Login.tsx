import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { session, signIn, resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!loading && session) return <Navigate to="/admin/dashboard" replace />;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError('Invalid email or password.');
      return;
    }
    navigate('/admin/dashboard', { replace: true });
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Enter your email first.'); return; }
    setBusy(true);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) { setError(err); return; }
    setResetSent(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#071A2B' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #00AEEF, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #00AEEF, transparent)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00AEEF] flex items-center justify-center mb-4 shadow-lg shadow-[#00AEEF]/25">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Mateen CMS</h1>
          <p className="text-white/40 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          {resetSent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">Password reset link sent to <strong>{email}</strong></p>
              <button
                onClick={() => { setResetSent(false); setShowReset(false); }}
                className="text-sm text-[#071A2B] font-semibold hover:underline"
              >
                Back to login
              </button>
            </div>
          ) : !showReset ? (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-5">Sign in to CMS</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/20 focus:border-[#071A2B] transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/20 focus:border-[#071A2B] transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
                >
                  {busy ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => { setShowReset(true); setError(''); }}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Forgot password?
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => { setShowReset(false); setError(''); }}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-4 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h2 className="text-base font-bold text-gray-900 mb-1">Reset password</h2>
              <p className="text-xs text-gray-500 mb-5">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleReset} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#071A2B]/20 focus:border-[#071A2B] transition-colors"
                  placeholder="admin@example.com"
                />
                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 bg-[#071A2B] text-white text-sm font-bold rounded-xl hover:bg-[#0f2d47] disabled:opacity-60 transition-colors"
                >
                  {busy ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} Mateen Documentation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
