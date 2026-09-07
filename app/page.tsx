'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Eye,
  EyeOff,
  XCircle,
  ArrowRight,
  Lock,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !email.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLoginError('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    // Save session in localStorage if not already existing
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('swiftdrop_user');
        if (!stored) {
          const defaultUser = {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            phone: '+1 (555) 349-8821',
            email: email.trim().toLowerCase(),
          };
          localStorage.setItem('swiftdrop_user', JSON.stringify(defaultUser));
        }
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 500);
  };

  const handleFillDemo = () => {
    setEmail('sarah.jenkins@example.com');
    setPassword('DeliverFast#2026');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      
      {/* Navigation Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-gray-900">
                SwiftDrop <span className="text-xs text-gray-500 font-normal">Logistics</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 hidden sm:inline">Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Register &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md space-y-4">
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Customer Sign In
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your customer credentials to access your dashboard and deliveries.
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Email Address Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@example.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link simulated. For quick access, you can also use the "Fill Demo Credentials" button below.')}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember my login</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="login-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Fill Helper */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fill Demo Credentials (Sarah Jenkins)</span>
                </button>
              </div>

              {/* Bottom Registration Prompt */}
              <div className="pt-3 text-center text-xs text-gray-500 border-t border-gray-100">
                New customer?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                  Create a customer account &rarr;
                </Link>
              </div>

            </form>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 SwiftDrop Logistics Inc.</span>
          <div className="flex items-center gap-4 text-gray-500">
            <Link href="/register" className="hover:text-gray-900">Registration</Link>
            <Link href="/dashboard" className="hover:text-gray-900">Customer Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
