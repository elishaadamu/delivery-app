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
  DollarSign,
  AlertCircle,
  Smartphone,
  Building,
  Truck,
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
  const [pickupAddress, setPickupAddress] = useState('14 Admiralty Way, Lekki Phase 1');
  const [pickupApt, setPickupApt] = useState('Block B, Flat 4');
  const [pickupCity, setPickupCity] = useState('Lagos');
  const [pickupPostal, setPickupPostal] = useState('105102');
  const [pickupTimeWindow, setPickupTimeWindow] = useState('Immediate / ASAP (Next 45 mins)');
  const [pickupNotes, setPickupNotes] = useState('Call security gate on arrival, flat is on 2nd floor');

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'bank_transfer' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('5399 •••• •••• 4242');
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
  const baseFare = 2500;
  const distanceFare = 3500;
  const weightFare = Math.round(weightNum * 600);
  const insurance = isFragile ? 1000 : 500;
  const subtotal = baseFare + distanceFare + weightFare + insurance;
  const total = Math.max(0, subtotal - discountApplied);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME20' || promoCode.trim().toUpperCase() === 'EXPRESS5') {
      setDiscountApplied(1000);
      setPromoSuccessMsg('Promo code applied: ₦1,000 discount.');
    } else {
      setBookingError('Invalid promo code. Try "WELCOME20".');
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
      const generatedTracking = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: DeliveryOrder = {
        id: `ord-${Date.now()}`,
        trackingNumber: generatedTracking,
        status: 'confirmed',
        createdAt: 'Just now',
        estimatedDelivery: 'Today in ~2 hours',
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
          total,
          promoCode: discountApplied > 0 ? promoCode : undefined,
          cardNumberMasked: paymentMethod === 'card' ? '•••• 4242' : undefined,
        },
        driver: sampleDriver,
        timeline: [
          {
            status: 'confirmed',
            title: 'Order Confirmed',
            description: 'Payment authorized and dispatch courier assigned.',
            timestamp: 'Just now',
            completed: true,
            current: true,
          },
          {
            status: 'in_transit',
            title: 'In Transit',
            description: 'Courier en route to pick up package from sender.',
            timestamp: 'Pending',
            completed: false,
            current: false,
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Delivery',
            description: 'Package in final transit to delivery location.',
            timestamp: 'Pending',
            completed: false,
            current: false,
          },
          {
            status: 'delivered',
            title: 'Delivered',
            description: 'Package handed over with digital proof.',
            timestamp: 'Pending',
            completed: false,
            current: false,
          },
        ],
      };

      setIsBooking(false);
      onOrderCreated(newOrder);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 overflow-y-auto">
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-xl shadow-lg overflow-hidden text-gray-900 my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Book Delivery</h3>
              <p className="text-xs text-gray-500">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Sender & Pickup Details' : currentStep === 2 ? 'Receiver & Package Specs' : 'Payment Details'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => setCurrentStep(1)}
            className={`font-semibold cursor-pointer ${
              currentStep === 1 ? 'text-blue-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            1. Sender Details
          </button>

          <span className="text-gray-300">&rarr;</span>

          <button
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`font-semibold ${
              currentStep === 2 ? 'text-blue-700' : currentStep > 2 ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            2. Receiver & Package
          </button>

          <span className="text-gray-300">&rarr;</span>

          <button
            className={`font-semibold ${
              currentStep === 3 ? 'text-blue-700' : 'text-gray-400'
            }`}
          >
            3. Payment
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {bookingError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* STEP 1: SENDER & PICKUP DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Sender Information (Pickup)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sender Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="0803 456 7890"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pickup Street Address *
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="14 Admiralty Way, Lekki Phase 1"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Suite / Flat / Floor
                    </label>
                    <input
                      type="text"
                      value={pickupApt}
                      onChange={(e) => setPickupApt(e.target.value)}
                      placeholder="Block B, Flat 4"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="Lagos"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={pickupPostal}
                      onChange={(e) => setPickupPostal(e.target.value)}
                      placeholder="105102"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Timing */}
              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Pickup Window
                </h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pickup Schedule
                  </label>
                  <select
                    value={pickupTimeWindow}
                    onChange={(e) => setPickupTimeWindow(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Immediate / ASAP (Next 45 mins)">Immediate / ASAP (Next 45 mins)</option>
                    <option value="Today Afternoon (01:00 PM - 04:00 PM)">Today Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="Tomorrow Morning (09:00 AM - 12:00 PM)">Tomorrow Morning (09:00 AM - 12:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pickup Notes (Gate codes, floor, concierge)
                  </label>
                  <input
                    type="text"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="Gate code #4490, 2nd floor"
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RECEIVER & PACKAGE SPECS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Receiver Information (Delivery)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiverName('Tunde Balogun');
                      setReceiverPhone('0814 555 1234');
                      setDeliveryAddress('28 Isaac John Street, GRA');
                      setDeliveryApt('Suite 2A');
                      setDeliveryCity('Ikeja, Lagos');
                      setDeliveryPostal('100271');
                      setPackageDesc('Architectural Plans & Document Folder');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    + Auto-fill Sample
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Receiver Name *
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. Tunde Balogun"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Receiver Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="0814 555 1234"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Delivery Street Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="28 Isaac John Street, GRA"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Apartment / Suite / Office
                    </label>
                    <input
                      type="text"
                      value={deliveryApt}
                      onChange={(e) => setDeliveryApt(e.target.value)}
                      placeholder="Suite 2A"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Ikeja, Lagos"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Call upon arrival, do not leave unattended"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  Package Information
                </h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Package Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'documents', label: 'Documents', desc: '< 0.5 kg' },
                      { id: 'small_box', label: 'Small Box', desc: '1 - 3 kg' },
                      { id: 'medium_box', label: 'Medium Parcel', desc: '3 - 10 kg' },
                      { id: 'cargo', label: 'Heavy Cargo', desc: '10+ kg' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setPackageCategory(cat.id as PackageDetails['category'])}
                        className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                          packageCategory === cat.id
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-xs font-semibold">{cat.label}</div>
                        <div className="text-[10px] text-gray-500">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Package Description *
                    </label>
                    <input
                      type="text"
                      value={packageDesc}
                      onChange={(e) => setPackageDesc(e.target.value)}
                      placeholder="e.g. Legal documents"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Fragile & Signature toggles */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 text-xs text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={isFragile}
                      onChange={(e) => setIsFragile(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span>Fragile (+ ₦1,000)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={requiresSignature}
                      onChange={(e) => setRequiresSignature(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span>Signature Required</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENTS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              
              {/* Payment Method Selector */}
              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-white">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Select Payment Method
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Debit / Card', icon: CreditCard },
                    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building },
                    { id: 'apple_pay', label: 'USSD / Mobile', icon: Smartphone },
                    { id: 'cod', label: 'Cash / POS', icon: DollarSign },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentDetails['method'])}
                        className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Card input mockup if Card is selected */}
                {paymentMethod === 'card' && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Expiry / CVC
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-1/2 px-1 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900 text-center"
                          />
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-1/2 px-1 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Box */}
              <div className="border border-gray-200 p-3 rounded-xl flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (Try: WELCOME20)"
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 uppercase"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-gray-300"
                >
                  Apply
                </button>
              </div>

              {promoSuccessMsg && (
                <div className="text-xs text-emerald-700 font-medium px-1">
                  {promoSuccessMsg}
                </div>
              )}

              {/* Order Cost Summary Table */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Delivery Fee Breakdown
                </h4>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Base Courier Fee</span>
                  <span className="text-gray-900">₦{baseFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Route Distance Fee</span>
                  <span className="text-gray-900">₦{distanceFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Weight Surcharge ({packageWeight} kg)</span>
                  <span className="text-gray-900">₦{weightFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Package Insurance</span>
                  <span className="text-gray-900">₦{insurance.toLocaleString()}</span>
                </div>

                {discountApplied > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                    <span>Promo Discount</span>
                    <span>-₦{discountApplied.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-base text-blue-700">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev === 3 ? 2 : 1))}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={currentStep === 1 ? handleNextStep1 : handleNextStep2}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isBooking}
              id="confirm-booking-pay-btn"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isBooking ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay ₦{total.toLocaleString()} & Confirm Delivery</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
