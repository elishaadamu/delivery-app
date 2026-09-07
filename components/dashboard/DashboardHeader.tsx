'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Bell,
} from 'lucide-react';
import { CustomerProfile } from '@/types/delivery';

interface DashboardHeaderProps {
  user: CustomerProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBookDelivery: () => void;
  activeOrdersCount: number;
}

export default function DashboardHeader({
  user,
  activeTab,
  setActiveTab,
  onOpenBookDelivery,
  activeOrdersCount,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-gray-900">
                SwiftDrop <span className="text-xs text-gray-500 font-normal">Express</span>
              </span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Overview & Tracking
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>Orders History</span>
                {activeOrdersCount > 0 && (
                  <span className="text-[11px] bg-blue-600 text-white rounded-full px-1.5 py-0.2 font-semibold">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Registration Page
              </Link>
            </nav>
          </div>

          {/* Right Action buttons & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBookDelivery}
              id="book-delivery-top-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Delivery</span>
            </button>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 flex items-center justify-center border border-gray-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs flex items-center justify-center">
                {user.firstName[0] || 'U'}{user.lastName[0] || 'S'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-gray-500 truncate max-w-[130px]">
                  {user.phone}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
