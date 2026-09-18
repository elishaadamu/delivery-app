'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import { Plus, Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { DeliveryOrder } from '@/types/delivery';

export default function WaybillsPage() {
  const router = useRouter();
  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    setIsBookModalOpen,
  } = useDashboard();

  const handleSelectOrder = (order: DeliveryOrder) => {
    setSelectedOrderId(order.id);
    router.push('/dashboard');
  };

  const activeCount = orders.filter((o) => o.status !== 'delivered').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Waybills & Consignments
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold font-mono shrink-0">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete shipment manifests, live transit telemetry checkpoints, and official FIRS tax invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Dispatch</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0e1420] border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Shipments</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {orders.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Recorded on profile</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1420] border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active In Transit</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Live GPS tracking active</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1420] border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Delivered & Signed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {deliveredCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">100% verified handovers</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1420] border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg. Delivery SLA</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-sans font-semibold">
            2.4 hrs
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Intra-city express</div>
        </div>
      </div>

      {/* Main Table */}
      <RecentOrdersTable
        orders={orders}
        selectedOrderId={selectedOrderId}
        onSelectOrder={handleSelectOrder}
        onReorder={() => setIsBookModalOpen(true)}
      />
    </div>
  );
}
