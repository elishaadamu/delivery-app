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
  Download,
  X,
} from 'lucide-react';

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
  const [receiptOrder, setReceiptOrder] = useState<DeliveryOrder | null>(null);

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          style: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'in_transit':
        return {
          label: 'In Transit',
          style: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          style: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (filter === 'active' && ord.status === 'delivered') return false;
    if (filter === 'delivered' && ord.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTracking = ord.trackingNumber.toLowerCase().includes(q);
      const matchReceiver = ord.receiver.fullName.toLowerCase().includes(q);
      const matchCity = ord.receiver.city.toLowerCase().includes(q) || ord.sender.city.toLowerCase().includes(q);
      const matchDesc = ord.packageInfo.description.toLowerCase().includes(q);
      return matchTracking || matchReceiver || matchCity || matchDesc;
    }

    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-5">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Recent Orders History</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 font-semibold">
              {orders.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            View shipment status history, download receipts, and reorder deliveries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-gray-900 text-white font-semibold'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'active'
                ? 'bg-gray-900 text-white font-semibold'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({orders.filter((o) => o.status !== 'delivered').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'delivered'
                ? 'bg-gray-900 text-white font-semibold'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by tracking number, recipient name, or city..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Orders List / Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">Tracking / Date</th>
              <th className="py-2.5 px-3">Route</th>
              <th className="py-2.5 px-3">Recipient</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const isSelected = ord.id === selectedOrderId;

                return (
                  <tr
                    key={ord.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {/* Tracking ID & Date */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-semibold text-gray-900 flex items-center gap-1.5">
                        <span>{ord.trackingNumber}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-sans font-medium">
                            Viewing
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {ord.createdAt}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-3 px-3">
                      <div className="text-gray-900 font-medium truncate max-w-[170px]">
                        {ord.sender.city} &rarr; {ord.receiver.city}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[170px]">
                        {ord.receiver.address}
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-3 px-3">
                      <div className="text-gray-900 font-medium">
                        {ord.receiver.fullName}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {ord.packageInfo.weight} kg • {ord.packageInfo.category.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.style}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      ${ord.payment.total.toFixed(2)}
                      <span className="block text-[10px] text-gray-500 font-normal capitalize">
                        {ord.payment.method.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Track</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setReceiptOrder(ord)}
                          title="View Invoice Receipt"
                          className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onReorder(ord)}
                          title="Reorder Delivery"
                          className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Invoice Receipt Modal Preview */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-md w-full shadow-lg text-gray-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-900 text-sm">Delivery Receipt</h4>
              </div>
              <button
                onClick={() => setReceiptOrder(null)}
                className="w-7 h-7 rounded text-gray-400 hover:text-gray-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Tracking Number:</span>
                <span className="font-mono font-bold text-gray-900">{receiptOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Order Date:</span>
                <span className="text-gray-800">{receiptOrder.createdAt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Status:</span>
                <span className="font-semibold text-emerald-700 capitalize">{receiptOrder.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Sender:</span>
                <span className="text-gray-800">{receiptOrder.sender.fullName} ({receiptOrder.sender.city})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Receiver:</span>
                <span className="text-gray-800">{receiptOrder.receiver.fullName} ({receiptOrder.receiver.city})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Package:</span>
                <span className="text-gray-800">{receiptOrder.packageInfo.weight} kg ({receiptOrder.packageInfo.category})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Payment Method:</span>
                <span className="text-gray-800 capitalize">{receiptOrder.payment.method.replace('_', ' ')}</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="text-blue-600">${receiptOrder.payment.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setReceiptOrder(null)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
