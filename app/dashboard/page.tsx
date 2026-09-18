'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import CustomerCard from '@/components/CustomerCard';
import OrderTrackingCard from '@/components/dashboard/OrderTrackingCard';
import {
  QrCode,
  Calculator,
  Building2,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  X,
  FileText,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { DeliveryStatus } from '@/types/delivery';

export default function DashboardOverviewPage() {
  const {
    user,
    setUser,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    handleStatusChange,
    handleOrderPaid,
    setIsBookModalOpen,
    setIsScannerOpen,
  } = useDashboard();

  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const selectedOrder =
    orders.find((o) => o.id === selectedOrderId || o.trackingNumber === selectedOrderId) ||
    orders[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner if enabled */}
      {showWelcomeBanner && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1420] border border-emerald-500/30 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Welcome to Swift Logistics, {user.firstName}!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Your enterprise account is active with automatic ₦2.5M cargo indemnity protection on all shipments.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWelcomeBanner(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Customer Corporate Card & Quick Stats */}
      <CustomerCard
        profile={user}
        onProfileUpdate={(updated) => setUser(updated)}
      />

      {/* Quick Action Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Dispatch</span>
        </button>

        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0e1420] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span>Scan Waybill / QR</span>
        </button>

        <Link
          href="/dashboard/tariffs"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0e1420] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Tariff Calculator</span>
        </Link>

        <Link
          href="/dashboard/hubs"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0e1420] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>24/7 Smart Lockers</span>
        </Link>

        <Link
          href="/dashboard/protection"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0e1420] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>₦2.5M Protection Policy</span>
        </Link>
      </div>

      {/* Active Waybills Selector Bar */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Active Consignments</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
                {orders.length} Waybills
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a consignment to inspect live route checkpoints and digital invoices.
            </p>
          </div>

          <Link
            href="/dashboard/waybills"
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Waybills Pill Switcher */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {orders.map((ord) => {
            const isSelected =
              ord.id === selectedOrder.id || ord.trackingNumber === selectedOrder.trackingNumber;
            const isDelivered = ord.status === 'delivered';
            const trackingNo = ord.trackingNumber || ord.id;

            return (
              <button
                key={ord.id}
                type="button"
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3.5 py-2.5 rounded-xl border text-left transition-all shrink-0 min-w-[210px] flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-sm'
                    : 'bg-[#0e1420] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-mono text-xs font-semibold text-emerald-400">
                    {trackingNo}
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium truncate max-w-[130px] mt-0.5">
                    {ord.receiver.city}
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isDelivered
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-emerald-500 text-black font-semibold'
                  }`}
                >
                  {isDelivered ? 'Delivered' : 'Live'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Tracking Card */}
      {selectedOrder && (
        <OrderTrackingCard
          order={selectedOrder}
          customer={user}
          onStatusChange={handleStatusChange}
          onOpenChatSupport={() => {}}
          onOrderPaid={handleOrderPaid}
        />
      )}

      {/* Recent Activity Snapshot & Link to Full Waybills Archive */}
      <div className="bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Manifests Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest consignments dispatched on your corporate profile.
            </p>
          </div>

          <Link
            href="/dashboard/waybills"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-slate-800 text-xs font-semibold transition-all"
          >
            <span>Full Waybills Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {orders.slice(0, 3).map((ord) => {
            const trackingNo = ord.trackingNumber || ord.id;
            const payment = ord.payment || ord.paymentDetails || { total: 0, isPaid: false };
            const isDelivered = ord.status === 'delivered';

            return (
              <div
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{trackingNo}</span>
                      <span>•</span>
                      <span>{ord.receiver.fullName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{ord.sender.city}</span>
                      <span>&rarr;</span>
                      <span>{ord.receiver.city}</span>
                      <span className="text-slate-600">•</span>
                      <span>{ord.packageInfo.description}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-sans font-bold text-xs text-white tabular-nums">
                    ₦{payment.total.toLocaleString()}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isDelivered ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isDelivered ? 'Delivered' : 'In Transit'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
