'use client';

import React, { useState } from 'react';
import {
  DeliveryOrder,
  DeliveryStatus,
} from '@/types/delivery';
import {
  Search,
  ArrowUpRight,
  FileText,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
} from 'lucide-react';
import { printOrderReceipt } from '@/lib/pdfService';

interface RecentOrdersTableProps {
  orders: DeliveryOrder[];
  selectedOrderId: string;
  onSelectOrder: (order: DeliveryOrder) => void;
  onReorder: (order: DeliveryOrder) => void;
}

export default function RecentOrdersTable({
  orders,
  selectedOrderId,
  onSelectOrder,
  onReorder,
}: RecentOrdersTableProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          style: 'bg-blue-950/80 text-blue-400 border-blue-500/30',
        };
      case 'in_transit':
        return {
          label: 'In Transit',
          style: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          style: 'bg-purple-950/80 text-purple-400 border-purple-500/30',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          style: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          style: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
        };
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (filter === 'active' && ord.status === 'delivered') return false;
    if (filter === 'delivered' && ord.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTracking = (ord.trackingNumber || ord.id).toLowerCase().includes(q);
      const matchReceiver = ord.receiver?.fullName?.toLowerCase().includes(q) || false;
      const matchCity = ord.receiver?.city?.toLowerCase().includes(q) || ord.sender?.city?.toLowerCase().includes(q) || false;
      const matchDesc = ord.packageInfo?.description?.toLowerCase().includes(q) || false;
      return matchTracking || matchReceiver || matchCity || matchDesc;
    }

    return true;
  });

  return (
    <div className="bg-[#0e1420] border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl text-slate-100">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Consignments & Waybills Archive</span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-semibold font-mono">
              {orders.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time delivery status, official tax invoice downloads, and waybill records.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active'
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Active ({orders.filter((o) => o.status !== 'delivered').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'delivered'
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by waybill (e.g. SW-LAG-9428), recipient name, city, or cargo description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 transition-colors"
        />
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Waybill Number</th>
              <th className="py-3 px-4">Consignee & Route</th>
              <th className="py-3 px-4">Cargo Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Amount (NGN)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  No shipments matching your search filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const isSelected = ord.id === selectedOrderId || ord.trackingNumber === selectedOrderId;
                const trackingNo = ord.trackingNumber || ord.id;
                const payment = ord.payment || ord.paymentDetails || { total: 0, isPaid: false };

                return (
                  <tr
                    key={ord.id}
                    className={`hover:bg-slate-900/70 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-950/20 border-l-2 border-l-emerald-500' : ''
                    }`}
                    onClick={() => onSelectOrder(ord)}
                  >
                    {/* Waybill */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span>{trackingNo}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {ord.createdAt}
                      </div>
                    </td>

                    {/* Consignee & Route */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">
                        {ord.receiver.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{ord.sender.city}</span>
                        <span className="text-slate-600">&rarr;</span>
                        <span>{ord.receiver.city}</span>
                      </div>
                    </td>

                    {/* Cargo */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-slate-200 font-medium">
                        {ord.packageInfo.description}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {ord.packageInfo.weight}kg • {ord.packageInfo.category}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.style}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-white">
                      <div className="font-sans font-bold tabular-nums text-sm tracking-tight">
                        ₦{payment.total.toLocaleString()}
                      </div>
                      <div className="text-[10px]">
                        {payment.isPaid ? (
                          <span className="text-emerald-400 font-medium">✓ Paid</span>
                        ) : (
                          <span className="text-amber-400 font-medium">Pending</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => printOrderReceipt(ord, null)}
                          title="Generate & Print Official Tax Receipt PDF"
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/80 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectOrder(ord)}
                          title="View Live Tracking Details"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all flex items-center gap-1"
                        >
                          <span>Track</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
