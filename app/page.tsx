'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { setUserSession, getUserSession, setLockStatus } from '@/lib/storage';
import { initialCustomerProfile } from '@/lib/mockData';
import { PinModal } from '@/components/PinModal';

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [savedUser, setSavedUser] = useState(false);

  useEffect(() => {
    const existing = getUserSession();
    if (existing) {
      setSavedUser(true);
      if (!email) {
        setEmail(existing.email);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim()) {
      setLoginError('Please enter your email or Nigerian phone number.');
      return;
    }
    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // Save/refresh session in localStorage (accept any credentials as requested)
    setTimeout(() => {
      const existing = getUserSession();
      const userProfile = existing || {
        ...initialCustomerProfile,
        email: email.trim(),
        firstName: email.split('@')[0].replace('.', ' ').split(' ')[0] || 'Elisha',
        lastName: email.split('@')[0].replace('.', ' ').split(' ')[1] || 'Adamu',
      };
      setUserSession(userProfile);
      setLockStatus(false);
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('elisha.adamu@swiftlogistics.ng');
    setPassword('Swift#2026');
    setLoginError('');
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    const existing = getUserSession() || initialCustomerProfile;
    setUserSession(existing);
    setLockStatus(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full bg-[#0c1322]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b1322] rounded-[10px] flex items-center justify-center text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Swift Logistics
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  NG
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-none">
                Nigeria Nationwide Express
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-400 hidden sm:inline">New to Swift?</span>
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/50 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition-all"
            >
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl bg-[#0f172a]/95 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
            
            {/* Header / Brand Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GOLD VIP ACCESS PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Access your priority logistics console, digital card & live waybills
              </p>
            </div>

            {/* Error banner */}
            {loginError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
                <span>{loginError}</span>
              </div>
            )}

            {/* Sign in form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elisha.adamu@swiftlogistics.ng"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPinModal(true)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Use PIN instead?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (any password accepted)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 4-Digit PIN Unlock Shortcut */}
            <div className="mt-5 pt-5 border-t border-slate-800 text-center space-y-3">
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Quick Unlock with 4-Digit PIN</span>
              </button>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-4"
              >
                Auto-fill Elisha Adamu Demo Credentials
              </button>
            </div>

            {/* Guarantee callout */}
            <div className="mt-6 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Protected by <strong>₦2,500,000</strong> transit cargo guarantee.
              </span>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>Swift Logistics Nigeria Limited • RC: 1892842 • FIRS TIN: 24891029-0001</p>
        <p className="mt-1">Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
      </footer>

      {/* Security PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onSuccess={handlePinSuccess}
        onClose={() => setShowPinModal(false)}
        title="Quick 4-Digit PIN Unlock"
        subtitle="Enter your security PIN to jump straight into your dashboard"
      />
    </div>
  );
}
