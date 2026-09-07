'use client';

import React, { useState } from 'react';
import {
  DeliveryOrder,
  DeliveryStatus,
} from '@/types/delivery';
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  Package,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

interface OrderTrackingCardProps {
  order: DeliveryOrder;
  onStatusChange: (orderId: string, newStatus: DeliveryStatus) => void;
  onOpenChatSupport: (contextText?: string) => void;
}

export default function OrderTrackingCard({
  order,
  onStatusChange,
  onOpenChatSupport,
}: OrderTrackingCardProps) {
  const [copied, setCopied] = useState(false);
  const [callAlert, setCallAlert] = useState(false);

  const copyTracking = () => {
    navigator.clipboard?.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfigs: Record<
    DeliveryStatus,
    {
      badge: string;
      badgeStyle: string;
      icon: React.ComponentType<{ className?: string }>;
      eta: string;
      progressPct: number;
      description: string;
    }
  > = {
    confirmed: {
      badge: 'Confirmed Order',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2,
      eta: 'Preparing for Pickup',
      progressPct: 15,
      description: 'Order confirmed and logistics courier assigned. Ready for scheduled pickup.',
    },
    in_transit: {
      badge: 'In Transit',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Truck,
      eta: 'Arriving in approx. 2.5 hrs',
      progressPct: 52,
      description: 'Package collected from sender and moving along regional express transit corridor.',
    },
    out_for_delivery: {
      badge: 'Out for Delivery',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: MapPin,
      eta: 'Arriving in ~18 minutes',
      progressPct: 82,
      description: 'Courier driver is on your local street, 2 stops away from the delivery address.',
    },
    delivered: {
      badge: 'Delivered',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      eta: 'Package Handed Over',
      progressPct: 100,
      description: 'Successfully handed over to recipient. Digital signature and proof recorded.',
    },
  };

  const currentConfig = statusConfigs[order.status];

  const stepStates = [
    {
      status: 'confirmed' as DeliveryStatus,
      title: 'Confirmed Order',
      desc: 'Order booked & verified',
      time: '09:15 AM',
    },
    {
      status: 'in_transit' as DeliveryStatus,
      title: 'In Transit',
      desc: 'En route between distribution hubs',
      time: '10:45 AM',
    },
    {
      status: 'out_for_delivery' as DeliveryStatus,
      title: 'Out for Delivery',
      desc: 'Driver Marcus Vance on last-mile route',
      time: '01:30 PM',
    },
    {
      status: 'delivered' as DeliveryStatus,
      title: 'Delivered',
      desc: 'Recipient handover & signature',
      time: '02:15 PM',
    },
  ];

  const getStepIndex = (status: DeliveryStatus) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'in_transit':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
    }
  };

  const currentIdx = getStepIndex(order.status);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-6">
      
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentConfig.badgeStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {currentConfig.badge}
            </span>

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-700 text-xs font-mono">
              <span>{order.trackingNumber}</span>
              <button
                onClick={copyTracking}
                aria-label="Copy tracking number"
                className="hover:text-gray-900 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              </button>
            </div>

            <span className="text-xs text-gray-500">
              Created {order.createdAt}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Delivery to {order.receiver.fullName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            {currentConfig.description}
          </p>
        </div>

        {/* Status Switcher Simulation Toolbar */}
        <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-semibold text-gray-500 px-2">
            Status:
          </span>
          {(['confirmed', 'in_transit', 'out_for_delivery', 'delivered'] as DeliveryStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(order.id, st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                order.status === st
                  ? 'bg-white text-gray-900 shadow-xs border border-gray-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {st === 'confirmed'
                ? 'Confirmed Order'
                : st === 'in_transit'
                ? 'In Transit'
                : st === 'out_for_delivery'
                ? 'Out for Delivery'
                : 'Delivered'}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Step Progress Stepper */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
        <div className="relative">
          
          {/* Horizontal Connecting Track for sm+ */}
          <div className="hidden sm:block absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentIdx / 3) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
            {stepStates.map((step, idx) => {
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={step.status}
                  onClick={() => onStatusChange(order.id, step.status)}
                  className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 group cursor-pointer"
                >
                  {/* Step Icon / Number Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-semibold ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-500 group-hover:border-gray-400'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Truck className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step Labels */}
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-blue-700'
                          : isPassed
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {step.desc}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {isPassed || isCurrent ? step.time : 'Scheduled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Live Route Map Representation */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5 flex flex-col justify-between space-y-5">
        
        {/* Route Header */}
        <div className="flex items-center justify-between text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-semibold text-gray-900">Live Delivery Route</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 font-medium">
            {currentConfig.eta}
          </div>
        </div>

        {/* Route Path Track */}
        <div className="my-2 px-2 sm:px-6">
          <div className="relative flex items-center justify-between">
            
            {/* Origin Node */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-900 mt-1">Sender</span>
              <span className="text-[10px] text-gray-500">{order.sender.city}</span>
            </div>

            {/* Connecting Dashed Line */}
            <div className="flex-1 mx-3 relative h-1 bg-gray-200 rounded-full">
              <svg className="absolute -top-1 left-0 w-full h-3 overflow-visible">
                <line
                  x1="0"
                  y1="4"
                  x2="100%"
                  y2="4"
                  stroke={order.status === 'delivered' ? '#16a34a' : '#2563eb'}
                  strokeWidth="2.5"
                  className="animate-dash"
                />
              </svg>

              {/* Moving Courier Icon on the line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${currentConfig.progressPct}%` }}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Destination Node */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs ${
                order.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {order.status === 'delivered' ? <Check className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-semibold text-gray-900 mt-1">Receiver</span>
              <span className="text-[10px] text-gray-500">{order.receiver.city}</span>
            </div>
          </div>
        </div>

        {/* Route Details Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Estimated Delivery: <strong className="text-gray-900">{order.estimatedDelivery}</strong></span>
          </div>
          <div>
            Route: {order.sender.address}, {order.sender.city} &rarr; {order.receiver.address}, {order.receiver.city}
          </div>
        </div>
      </div>

      {/* Driver Card & Package Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Courier Driver Card (7 cols) */}
        {order.driver && (
          <div className="lg:col-span-7 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Assigned Courier Driver
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Courier
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center shrink-0">
                  {order.driver.name.split(' ').map((n) => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">
                      {order.driver.name}
                    </h4>
                    <span className="text-xs font-semibold text-amber-700">
                      ★ {order.driver.rating.toFixed(1)} ({order.driver.totalDeliveries} trips)
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-0.5">
                    {order.driver.vehicleModel}
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                    Plate: {order.driver.vehiclePlate}
                  </p>

                  <div className="mt-2 text-xs text-blue-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location: {order.driver.currentLocationName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Quick Actions */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2">
              <button
                onClick={() => {
                  setCallAlert(true);
                  setTimeout(() => setCallAlert(false), 3000);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-300 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Driver</span>
              </button>

              <button
                onClick={() => onOpenChatSupport(`Inquiry regarding Driver ${order.driver?.name} on Order ${order.trackingNumber}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Message Driver</span>
              </button>
            </div>

            {callAlert && (
              <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-2 text-center">
                Calling {order.driver.name} ({order.driver.phone})...
              </div>
            )}
          </div>
        )}

        {/* Package Specifications & Delivery Instructions (5 cols) */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
              <Package className="w-3.5 h-3.5 text-gray-500" />
              Package Specifications
            </span>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Category:</span>
                <span className="font-semibold text-gray-900 capitalize">{order.packageInfo.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Weight:</span>
                <span className="font-semibold text-gray-900">{order.packageInfo.weight} kg</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Contents:</span>
                <span className="font-semibold text-gray-900 truncate max-w-[150px]">{order.packageInfo.description}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment:</span>
                <span className="font-semibold text-gray-900">${order.payment.total.toFixed(2)} ({order.payment.method.replace('_', ' ')})</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {order.packageInfo.isFragile && (
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                  Fragile
                </span>
              )}
              {order.packageInfo.requiresSignature && (
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-semibold border border-blue-200">
                  Signature Required
                </span>
              )}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
            <strong className="text-gray-700 block">Delivery Note:</strong>
            {order.receiver.deliveryInstructions || 'Leave with concierge at front desk.'}
          </div>
        </div>

      </div>

      {/* Delivered Proof Banner (shown when Delivered) */}
      {order.status === 'delivered' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Delivery Completed Successfully</h4>
              <p className="text-xs text-gray-600">Signed for by recipient at 02:15 PM.</p>
            </div>
          </div>

          <button
            onClick={() => onOpenChatSupport(`Requesting electronic delivery proof receipt for ${order.trackingNumber}`)}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Delivery Receipt</span>
          </button>
        </div>
      )}

    </div>
  );
}
