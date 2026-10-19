import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, switchDemoRole, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('admin@lumaatelier.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = (route: string) => {
    window.history.pushState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isAuthenticated) {
    navigateTo('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigateTo('/admin');
    } else {
      setError(res.error || 'Failed to authenticate.');
    }
  };

  const handleQuickDemo = () => {
    switchDemoRole('owner');
    navigateTo('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-8 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#26231F] text-white flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-6 h-6 text-[#B64E35]" />
          </div>
          <h1 className="font-serif font-black text-2xl text-[#25231F] pt-2">
            Salon Management
          </h1>
          <p className="text-xs text-[#77736D]">
            Access appointments, service catalog, branch management, and website configuration.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#77736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lumaatelier.com"
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#77736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Track Card */}
        {import.meta.env.DEV && <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#25231F]">
            <ShieldCheck className="w-4 h-4 text-[#B64E35]" />
            <span>Digital Agency Demonstration Mode</span>
          </div>
          <p className="text-[11px] text-[#77736D]">
            Use the administrator credentials configured in your server <code>.env</code> file.
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full bg-[#26231F] hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-2xs"
          >
            Instant 1-Click Demo Login
          </button>
        </div>}

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="text-xs text-[#77736D] hover:text-[#25231F] transition-colors"
          >
            ← Return to Customer Website
          </button>
        </div>
      </div>
    </div>
  );
};
