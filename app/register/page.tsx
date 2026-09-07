'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Password criteria computation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMetCount = [hasMinLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;

  const getStrengthMeta = () => {
    if (password.length === 0) return { label: '', color: 'bg-gray-200', pct: '0%' };
    if (criteriaMetCount <= 1) return { label: 'Weak', color: 'bg-red-500', pct: '25%' };
    if (criteriaMetCount === 2) return { label: 'Fair', color: 'bg-amber-500', pct: '50%' };
    if (criteriaMetCount === 3) return { label: 'Good', color: 'bg-blue-600', pct: '75%' };
    return { label: 'Strong', color: 'bg-emerald-600', pct: '100%' };
  };

  const strength = getStrengthMeta();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!firstName.trim() || !lastName.trim()) {
      setSubmitError('Please enter both your first and last name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setSubmitError('Please enter your phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setSubmitError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const profile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('swiftdrop_user', JSON.stringify(profile));
      }
    } catch {
      // ignore storage errors
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard?new_user=true');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-gray-900">
                SwiftDrop
              </span>
              <span className="text-xs text-gray-500 block -mt-1">Customer Logistics</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Customer Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg">
          
          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Customer Registration
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create your account to book deliveries, track orders, and manage shipments.
              </p>
            </div>

            {submitError && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="first-name" className="block text-xs font-semibold text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Chidinma"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-xs font-semibold text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Adeleke"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0803 456 7890"
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Required for courier driver dispatch and arrival verification.
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chidinma.adeleke@example.com"
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {/* Password with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="new-password" className="block text-xs font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  {password.length > 0 && (
                    <span className="text-xs font-medium text-gray-600">
                      Strength: <strong className="text-gray-900">{strength.label}</strong>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    name="new-password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3.5 pr-11 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
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

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.pct }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-500 pt-0.5">
                      <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-medium' : ''}`}>
                        {hasMinLength ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block mr-1" />}
                        8+ characters
                      </span>
                      <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-medium' : ''}`}>
                        {hasNumber ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block mr-1" />}
                        At least 1 number
                      </span>
                      <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-700 font-medium' : ''}`}>
                        {hasUpper ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block mr-1" />}
                        Uppercase letter
                      </span>
                      <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-medium' : ''}`}>
                        {hasSpecial ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block mr-1" />}
                        Special character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="register-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Create Customer Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Bottom login link */}
              <div className="pt-2 text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Sign in here &rarr;
                </Link>
              </div>
            </form>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-5 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 SwiftDrop Logistics Inc.</span>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Terms</span>
            <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-900 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
