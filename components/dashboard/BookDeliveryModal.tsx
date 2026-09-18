'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Package,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Building,
  Truck,
  Wallet,
} from 'lucide-react';
import { CustomerProfile, DeliveryOrder, PackageDetails, PaymentDetails } from '@/types/delivery';
import { sampleDriver } from '@/lib/mockData';

interface BookDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CustomerProfile;
  onOrderCreated: (newOrder: DeliveryOrder) => void;
}

export default function BookDeliveryModal({
  isOpen,
  onClose,
  user,
  onOrderCreated,
}: BookDeliveryModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Sender Details
  const [senderName, setSenderName] = useState(`${user.firstName} ${user.lastName}`);
  const [senderPhone, setSenderPhone] = useState(user.phone);
  const [pickupAddress, setPickupAddress] = useState(user.address || 'Plot 14 Admiralty Way, Lekki Phase 1');
  const [pickupApt, setPickupApt] = useState('Penthouse Suite 4');
  const [pickupCity, setPickupCity] = useState('Lagos');
  const [pickupPostal, setPickupPostal] = useState('105102');
  const [pickupTimeWindow, setPickupTimeWindow] = useState('Immediate / ASAP (Next 45 mins)');
  const [pickupNotes, setPickupNotes] = useState('Call security gate on arrival');

  // Step 2: Receiver Details & Package
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryApt, setDeliveryApt] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryPostal, setDeliveryPostal] = useState('100271');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Call receiver on arrival');

  const [packageCategory, setPackageCategory] = useState<'documents' | 'small_box' | 'medium_box' | 'cargo'>('small_box');
  const [packageWeight, setPackageWeight] = useState('2.5');
  const [packageDesc, setPackageDesc] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [requiresSignature, setRequiresSignature] = useState(true);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paystack' | 'bank_transfer' | 'wallet'>('paystack');
  const [cardNumber, setCardNumber] = useState('5399 •••• •••• 8920');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [cardName, setCardName] = useState(`${user.firstName} ${user.lastName}`);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  // Processing state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Pricing calculations (in Naira ₦)
  const weightNum = parseFloat(packageWeight) || 1;
  const baseFare = 4500;
  const distanceFare = 3500;
  const weightFare = Math.round(weightNum * 600);
  const insurance = 1500;
  const subtotal = baseFare + distanceFare + weightFare + insurance;
  const vat = Math.round(subtotal * 0.075);
  const total = Math.max(0, subtotal + vat - discountApplied);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SWIFT20' || code === 'WELCOME20') {
      const discount = Math.min(3000, Math.round(subtotal * 0.2));
      setDiscountApplied(discount);
      setPromoSuccessMsg(`Promo ${code} applied: ₦${discount.toLocaleString()} discount.`);
    } else {
      setBookingError('Invalid promo code. Try "SWIFT20" for 20% discount.');
      setTimeout(() => setBookingError(''), 3000);
    }
  };

  const handleNextStep1 = () => {
    if (!senderName.trim() || !senderPhone.trim() || !pickupAddress.trim() || !pickupCity.trim()) {
      setBookingError('Please fill all required sender fields.');
      return;
    }
    setBookingError('');
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!receiverName.trim() || !receiverPhone.trim() || !deliveryAddress.trim() || !deliveryCity.trim()) {
      setBookingError('Please fill all required receiver fields.');
      return;
    }
    if (!packageDesc.trim()) {
      setBookingError('Please provide a brief package description.');
      return;
    }
    setBookingError('');
    setCurrentStep(3);
  };

  const handleConfirmOrder = () => {
    setBookingError('');
    setIsBooking(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const prefix = deliveryCity.toLowerCase().includes('abj') || deliveryCity.toLowerCase().includes('abuja') 
        ? 'SW-ABJ' 
        : deliveryCity.toLowerCase().includes('ph') || deliveryCity.toLowerCase().includes('harcourt')
        ? 'SW-PHC'
        : 'SW-LAG';
      const generatedTracking = `${prefix}-${randomSuffix}`;

      const newOrder: DeliveryOrder = {
        id: `ord-${Date.now()}`,
        trackingNumber: generatedTracking,
        status: 'confirmed',
        createdAt: 'Just now',
        estimatedDelivery: 'Today in ~2.5 hours',
        sender: {
          fullName: senderName,
          phone: senderPhone,
          address: pickupAddress,
          apartment: pickupApt,
          city: pickupCity,
          postalCode: pickupPostal || '105102',
          pickupTimeWindow,
          pickupNotes,
        },
        receiver: {
          fullName: receiverName,
          phone: receiverPhone,
          address: deliveryAddress,
          apartment: deliveryApt,
          city: deliveryCity,
          postalCode: deliveryPostal || '100271',
          deliveryInstructions,
        },
        packageInfo: {
          category: packageCategory,
          weight: weightNum,
          description: packageDesc,
          isFragile,
          requiresSignature,
        },
        payment: {
          method: paymentMethod,
          baseFare,
          distanceFare,
          weightFare,
          insurance,
          discount: discountApplied,
          vat,
          total,
          isPaid: true,
          paidDate: 'Just now via ' + (paymentMethod === 'wallet' ? 'NGN Wallet' : 'Paystack'),
          promoCode: discountApplied > 0 ? promoCode : '',
          cardNumberMasked: '•••• 8920',
        },
        driver: sampleDriver,
        timeline: [
          {
            status: 'confirmed',
            title: 'Consignment Confirmed & Paid',
            description: 'Waybill created and dispatch assigned.',
            timestamp: 'Just now',
            completed: true,
            current: true,
          },
          {
            status: 'in_transit',
            title: 'In Regional Transit',
            description: 'Moving along express dispatch corridor.',
            timestamp: 'Pending Dispatch',
            completed: false,
            current: false,
          },
          {
            status: 'out_for_delivery',
            title: 'Doorstep Courier Handover',
            description: 'Assigned to courier for delivery.',
            timestamp: 'Pending',
            completed: false,
            current: false,
          },
          {
            status: 'delivered',
            title: 'Delivered & Stamped',
            description: 'Handed over with digital signature.',
            timestamp: 'Pending',
            completed: false,
            current: false,
          },
        ],
      };

      setIsBooking(false);
      onOrderCreated(newOrder);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0f172a] border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c1322]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Book Priority Consignment</h3>
              <p className="text-xs text-slate-400">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Sender & Pickup Details' : currentStep === 2 ? 'Receiver & Cargo Specs' : 'Payment Settlement'
                }
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`font-bold transition-colors ${
              currentStep === 1 ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Pickup Hub
          </button>

          <span className="text-slate-600">&rarr;</span>

          <button
            type="button"
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`font-bold transition-colors ${
              currentStep === 2 ? 'text-emerald-400' : currentStep > 2 ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            2. Receiver & Cargo
          </button>

          <span className="text-slate-600">&rarr;</span>

          <button
            type="button"
            className={`font-bold ${
              currentStep === 3 ? 'text-emerald-400' : 'text-slate-600'
            }`}
          >
            3. Payment
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
          
          {bookingError && (
            <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* STEP 1: SENDER & PICKUP DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 bg-slate-900/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Sender Information (Pickup)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Sender Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+234 803 456 7890"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Pickup Street Address *
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Plot 14 Admiralty Way, Lekki Phase 1"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Suite / Flat / Floor
                    </label>
                    <input
                      type="text"
                      value={pickupApt}
                      onChange={(e) => setPickupApt(e.target.value)}
                      placeholder="Penthouse Suite 4"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="Lagos State"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Timing */}
              <div className="border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 bg-slate-900/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Pickup Window & Instructions
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pickup Schedule
                  </label>
                  <select
                    value={pickupTimeWindow}
                    onChange={(e) => setPickupTimeWindow(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Immediate / ASAP (Next 45 mins)">Immediate / ASAP (Next 45 mins)</option>
                    <option value="Today Afternoon (01:00 PM - 04:00 PM)">Today Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="Tomorrow Morning (09:00 AM - 12:00 PM)">Tomorrow Morning (09:00 AM - 12:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pickup Notes (Security gate codes, reception)
                  </label>
                  <input
                    type="text"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="Gate code #4490, 2nd floor"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RECEIVER & CARGO SPECS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Receiver Information (Delivery)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiverName('Babajide Sanusi');
                      setReceiverPhone('+234 812 345 6789');
                      setDeliveryAddress('18 Obafemi Awolowo Way, Ikeja');
                      setDeliveryApt('Suite 2B');
                      setDeliveryCity('Ikeja, Lagos');
                      setPackageDesc('MacBook Pro & Development Accessories');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    + Auto-fill Sample
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Receiver Name *
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. Babajide Sanusi"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Receiver Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Delivery Street Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="18 Obafemi Awolowo Way"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Ikeja, Lagos"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Call upon arrival"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 bg-slate-900/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-400" />
                  Cargo Specifications
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Classification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'documents', label: 'Documents', desc: '< 0.5 kg' },
                      { id: 'small_box', label: 'Small Box', desc: '1 - 3 kg' },
                      { id: 'medium_box', label: 'Medium Box', desc: '3 - 10 kg' },
                      { id: 'cargo', label: 'Heavy Cargo', desc: '10+ kg' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setPackageCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          packageCategory === cat.id
                            ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{cat.label}</div>
                        <div className="text-[10px] text-slate-500">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cargo Description *
                    </label>
                    <input
                      type="text"
                      value={packageDesc}
                      onChange={(e) => setPackageDesc(e.target.value)}
                      placeholder="e.g. MacBook Pro M3 & Peripherals"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Fragile & Signature toggles */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={isFragile}
                      onChange={(e) => setIsFragile(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500"
                    />
                    <span>Fragile Cargo (+ ₦1,000)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={requiresSignature}
                      onChange={(e) => setRequiresSignature(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500"
                    />
                    <span>PIN / Digital Signature Required</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENTS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 bg-slate-900/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Payment Rail
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'paystack', label: 'Paystack', icon: CreditCard },
                    { id: 'wallet', label: 'Prepaid Wallet', icon: Wallet },
                    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building },
                    { id: 'card', label: 'Debit Card', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === m.id
                            ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="border border-slate-800 p-3 rounded-2xl flex items-center gap-2 bg-slate-900">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo voucher (e.g. SWIFT20)"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 uppercase font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Apply
                </button>
              </div>

              {promoSuccessMsg && (
                <div className="text-xs text-emerald-400 font-bold px-1">
                  ✓ {promoSuccessMsg}
                </div>
              )}

              {/* Order Cost Summary Table */}
              <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 bg-slate-900/80">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Freight Fee Breakdown
                </h4>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Base Express Courier Fee</span>
                  <span className="text-white font-mono">₦{baseFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Corridor Transit Fee</span>
                  <span className="text-white font-mono">₦{distanceFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Weight Surcharge ({packageWeight} kg)</span>
                  <span className="text-white font-mono">₦{weightFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>₦2.5M Transit Cargo Protection</span>
                  <span className="text-white font-mono">₦{insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>FIRS Statutory VAT (7.5%)</span>
                  <span className="text-white font-mono">₦{vat.toLocaleString()}</span>
                </div>

                {discountApplied > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold">
                    <span>Promo Discount (SWIFT20)</span>
                    <span>-₦{discountApplied.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm font-extrabold text-white">
                  <span>Total Due</span>
                  <span className="text-lg text-emerald-400 font-mono">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0c1322] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev === 3 ? 2 : 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={currentStep === 1 ? handleNextStep1 : handleNextStep2}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isBooking}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-60"
            >
              {isBooking ? (
                <span>Dispatching Consignment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay ₦{total.toLocaleString()} & Book Consignment</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
