'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Truck,
  Plus,
  LogOut,
  Lock,
  ShieldCheck,
  Calculator,
  Building2,
  FileText,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { CustomerProfile } from '@/types/delivery';
import { clearUserSession, setLockStatus } from '@/lib/storage';

interface DashboardHeaderProps {
  user: CustomerProfile;
  onOpenBookDelivery: () => void;
  onTriggerLock?: () => void;
  activeOrdersCount: number;
}

export default function DashboardHeader({
  user,
  onOpenBookDelivery,
  onTriggerLock,
  activeOrdersCount,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    clearUserSession();
    router.push('/');
  };

  const handleLock = () => {
    setLockStatus(true);
    if (onTriggerLock) {
      onTriggerLock();
    }
  };

  const navLinks = [
    {
      label: 'Overview',
      fullLabel: 'Overview & Tracking',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Waybills',
      fullLabel: 'Waybills History',
      href: '/dashboard/waybills',
      icon: FileText,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
    },
    {
      label: 'Tariffs',
      fullLabel: 'Tariff Calculator',
      href: '/dashboard/tariffs',
      icon: Calculator,
      badge: null,
    },
    {
      label: 'Hubs',
      fullLabel: 'Hubs & Lockers',
      href: '/dashboard/hubs',
      icon: Building2,
      badge: null,
    },
    {
      label: 'Protection',
      fullLabel: 'Cargo Protection',
      href: '/dashboard/protection',
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 lg:gap-6 xl:gap-8 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                    Swift Logistics
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1 py-0.2 rounded">
                    NG
                  </span>
                </div>
                <div className="hidden sm:block text-[10px] text-slate-400 font-mono leading-none">
                  Lagos • Abuja • PHC
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links (Compact labels so it fits at 1024px-1300px without overflow) */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline">{item.fullLabel}</span>
                    <span className="xl:hidden">{item.label}</span>
                    {item.badge !== null && (
                      <span className="text-[10px] bg-emerald-500 text-black font-extrabold rounded-full px-1.5 py-0.2 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Book Dispatch Primary CTA */}
            <button
              type="button"
              onClick={onOpenBookDelivery}
              id="book-delivery-top-btn"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Book Dispatch</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Quick PIN Lock button (visible on tablet/desktop, moved to drawer on mobile) */}
            <button
              type="button"
              onClick={handleLock}
              title="Lock Screen with Security PIN"
              className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 items-center justify-center border border-slate-800 transition-colors shrink-0"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                {user.firstName ? user.firstName[0].toUpperCase() : 'E'}
              </div>

              <div className="hidden xl:block text-left max-w-[120px]">
                <div className="text-xs font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {user.membershipId || 'NG-7842-8920'}
                </div>
              </div>

              {/* Sign Out Button (visible on tablet/desktop, moved to drawer on mobile) */}
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 items-center justify-center border border-slate-800 hover:border-red-500/30 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile/Tablet Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800/80 space-y-2 animate-fade-in">
            {/* User Details on Mobile */}
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between sm:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {user.firstName ? user.firstName[0].toUpperCase() : 'E'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {user.membershipId || 'NG-7842-8920'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleLock}
                  title="Lock Session"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.fullLabel}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="text-[10px] bg-emerald-500 text-black font-extrabold rounded-full px-1.5 py-0.2 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
