'use client';

import React, { useState } from 'react';
import {
  DeliveryOrder,
  DeliveryStatus,
  CustomerProfile,
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
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { printOrderReceipt } from '@/lib/pdfService';
import { markPackageAsPaid } from '@/lib/mockData';

interface OrderTrackingCardProps {
  order: DeliveryOrder;
  customer?: CustomerProfile | null;
  onStatusChange: (orderId: string, newStatus: DeliveryStatus) => void;
  onOpenChatSupport: (contextText?: string) => void;
  onOrderPaid?: (orderId: string) => void;
}

export default function OrderTrackingCard({
  order,
  customer,
  onStatusChange,
  onOpenChatSupport,
  onOrderPaid,
}: OrderTrackingCardProps) {
  const [copied, setCopied] = useState(false);
  const [callAlert, setCallAlert] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'paystack' | 'wallet' | 'transfer'>('paystack');

  const trackingNo = order.trackingNumber || order.id;
  const payment = order.payment || order.paymentDetails || {
    subtotal: 12500,
    deliveryFee: 2500,
    serviceFee: 500,
    insurance: 1500,
    vat: 1125,
    discount: 0,
    total: 17625,
    isPaid: false,
  };

  const isPaid = payment.isPaid ?? false;

  const copyTracking = () => {
    navigator.clipboard?.writeText(trackingNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    printOrderReceipt(order, customer);
  };

  const handleProcessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      markPackageAsPaid(order.id, selectedPayMethod === 'wallet' ? 'NGN Prepaid Wallet' : 'Paystack Nigeria');
      setIsPaying(false);
      if (onOrderPaid) {
        onOrderPaid(order.id);
      }
    }, 1000);
  };

  const statusConfigs: Record<
    DeliveryStatus,
    {
      badge: string;
      badgeStyle: string;
      eta: string;
      progressPct: number;
      description: string;
    }
  > = {
    confirmed: {
      badge: 'Order Confirmed',
      badgeStyle: 'bg-blue-950/80 text-blue-400 border-blue-500/40',
      eta: 'Preparing at Origin Depot',
      progressPct: 15,
      description: 'Shipment registered and customs/logistics manifests verified.',
    },
    in_transit: {
      badge: 'In Transit',
      badgeStyle: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
      eta: 'Arriving Today approx. 2:45 PM',
      progressPct: 58,
      description: 'Moving along regional expressway transit corridor with live telemetry.',
    },
    out_for_delivery: {
      badge: 'Out for Delivery',
      badgeStyle: 'bg-purple-950/80 text-purple-400 border-purple-500/40',
      eta: 'Arriving in ~20 minutes',
      progressPct: 85,
      description: 'Courier driver is on your local delivery street, 2 stops away.',
    },
    delivered: {
      badge: 'Delivered & Stamped',
      badgeStyle: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
      eta: 'Handed Over & Verified',
      progressPct: 100,
      description: 'Successfully handed over to recipient. Digital signature and proof recorded.',
    },
    pending: {
      badge: 'Awaiting Dispatch',
      badgeStyle: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
      eta: 'Scheduled Dispatch',
      progressPct: 10,
      description: 'Shipment waybill generated, waiting for scheduled trunk pickup.',
    },
  };

  const currentConfig = statusConfigs[order.status] || statusConfigs.in_transit;

  const stepStates = [
    {
      status: 'confirmed' as DeliveryStatus,
      title: 'Confirmed Waybill',
      desc: 'Manifest verified & sealed',
      time: '09:15 AM',
    },
    {
      status: 'in_transit' as DeliveryStatus,
      title: 'Regional Trunk Transit',
      desc: 'Express highway corridor',
      time: '01:20 PM',
    },
    {
      status: 'out_for_delivery' as DeliveryStatus,
      title: 'Last-Mile Dispatch',
      desc: order.driver ? `${order.driver.name} en route` : 'Courier on last-mile route',
      time: '02:30 PM',
    },
    {
      status: 'delivered' as DeliveryStatus,
      title: 'Recipient Handover',
      desc: 'Security code & digital signature',
      time: '02:45 PM',
    },
  ];

  const getStepIndex = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 0;
      case 'in_transit':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentIdx = getStepIndex(order.status);
  const clampedProgressPct = Math.max(6, Math.min(94, currentConfig.progressPct));

  return (
    <div className="bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl text-slate-100 relative overflow-hidden">
      
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentConfig.badgeStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {currentConfig.badge}
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <span className="font-semibold text-white">{trackingNo}</span>
              <button
                type="button"
                onClick={copyTracking}
                title="Copy waybill ID"
                className="hover:text-emerald-400 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>

            <span className="text-xs text-slate-500">
              Created {order.createdAt}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Consignment to {order.receiver.fullName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentConfig.description}
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2">
            Simulate:
          </span>
          {(['confirmed', 'in_transit', 'out_for_delivery', 'delivered'] as DeliveryStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(order.id, st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                order.status === st
                  ? 'bg-emerald-500 text-black shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === 'confirmed'
                ? 'Confirmed'
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
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="relative">
          {/* Connecting Track */}
          <div className="hidden sm:block absolute top-4 left-10 right-10 h-0.5 bg-slate-800 -z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]"
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
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-xs font-bold ${
                      isCurrent
                        ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30'
                        : isPassed
                        ? 'bg-emerald-600 text-black'
                        : 'bg-slate-850 border border-slate-700 text-slate-500 group-hover:border-slate-600'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <Truck className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-emerald-400'
                          : isPassed
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      {step.desc}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                      {isPassed || isCurrent ? step.time : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Route Map Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white">Live Telemetry Track</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold border border-slate-700 text-xs">
            {currentConfig.eta}
          </div>
        </div>

        {/* Path Track with moving courier */}
        <div className="my-2 px-2 sm:px-6">
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">Origin</span>
              <span className="text-[10px] text-slate-400">{order.sender.city}</span>
            </div>

            <div className="flex-1 mx-4 relative h-1.5 bg-slate-800 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${currentConfig.progressPct}%` }}
              />

              {/* Moving Courier Icon (Clamped to avoid overlapping origin/destination markers) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${clampedProgressPct}%` }}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center border-2 border-[#0e1420] shadow-md">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs ${
                order.status === 'delivered'
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {order.status === 'delivered' ? <Check className="w-4 h-4 stroke-[3]" /> : <MapPin className="w-4 h-4" />}
              </div>
              <span className="text-[11px] font-bold text-white mt-1">Destination</span>
              <span className="text-[10px] text-slate-400">{order.receiver.city}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>ETA Delivery: <strong className="text-white">{order.estimatedDelivery}</strong></span>
          </div>
          <div className="truncate max-w-md">
            Route: {order.sender.address}, {order.sender.city} &rarr; {order.receiver.address}, {order.receiver.city}
          </div>
        </div>
      </div>

      {/* Driver & Consignment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Driver Card */}
        {order.driver && (
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Fleet Courier
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  ON ROUTE
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-[#0b1322] rounded-[14px] flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                    {order.driver.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      {order.driver.name}
                    </h4>
                    <span className="text-xs font-bold text-amber-400">
                      ★ {order.driver.rating.toFixed(1)} ({order.driver.totalDeliveries} trips)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-0.5">
                    {order.driver.vehicleModel}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Plate: {order.driver.vehiclePlate}
                  </p>

                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location: {order.driver.currentLocationName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCallAlert(true);
                  setTimeout(() => setCallAlert(false), 3000);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Courier ({order.driver.phone})</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenChatSupport(`Inquiring about shipment ${trackingNo}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>Chat Concierge</span>
              </button>
            </div>

            {callAlert && (
              <div className="mt-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs text-center">
                Dialing driver {order.driver.phone}...
              </div>
            )}
          </div>
        )}

        {/* Consignment Package Specs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Consignment Details
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {order.packageInfo.weight} KG
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white font-medium leading-relaxed">
                  {order.packageInfo.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                  {order.packageInfo.category}
                </span>
                {order.packageInfo.isFragile && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                    Fragile
                  </span>
                )}
                {order.packageInfo.requiresSignature && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    PIN Signature
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 mt-4">
            <strong className="text-slate-300 block mb-0.5">Instructions:</strong>
            {order.receiver.deliveryInstructions || 'Leave at security reception if unavailable.'}
          </div>
        </div>
      </div>

      {/* Settlement & Official PDF Receipt Section */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Billing & Tax Settlement
              </span>
              {isPaid ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  ✓ SETTLED & PAID
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  PAYMENT DUE
                </span>
              )}
            </div>

            <div className="text-2xl font-bold text-white mt-1 font-sans tabular-nums">
              ₦{payment.total.toLocaleString()} <span className="text-xs font-normal text-slate-400">NGN (VAT incl.)</span>
            </div>
            {payment.paidDate && (
              <div className="text-xs text-emerald-400 mt-0.5">
                {payment.paidDate}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 active:scale-95 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Tax Receipt PDF</span>
            </button>

            {!isPaid && (
              <button
                type="button"
                disabled={isPaying}
                onClick={handleProcessPayment}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold active:scale-95 transition-all shadow-sm"
              >
                {isPaying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span className="tabular-nums">Pay ₦{payment.total.toLocaleString()}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Resolved Post-Payment Flow: Next Actions */}
        {isPaid && (
          <div className="pt-4 border-t border-slate-800/80">
            <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Payment Verified — What would you like to do next?</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onStatusChange(order.id, 'in_transit')}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Live Progress</span>
              </button>

              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Download Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenChatSupport(`Concierge assistance for waybill ${trackingNo}`)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Dispatch Concierge</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
