import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLogin, onReturnToStore, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = await onLogin(email.trim(), password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Return to storefront link */}
        <button
          type="button"
          onClick={onReturnToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PerfumeGo Storefront</span>
        </button>

        {/* Card Box */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xl shadow-neutral-900/5 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-neutral-950/5 p-2 flex items-center justify-center mx-auto border border-amber-900/15 shadow-sm">
              <img
                src="/logo.png"
                alt="PerfumeGo Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                Perfume<span className="text-amber-700">Go</span> Admin
              </h1>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                Restricted management portal for authorized fragrance directors.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@perfumego.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Environmental config badge */}
          <div className="pt-2 border-t border-neutral-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Admins managed via <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700 font-mono">ADMIN_USERS</code> environment variable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
