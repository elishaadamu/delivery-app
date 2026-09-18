'use client';

import React, { useState } from 'react';
import { CustomerProfile } from '@/types/delivery';
import { 
  Sparkles, 
  PlusCircle, 
  QrCode, 
  ShieldCheck, 
  Wallet, 
  X, 
  CheckCircle2, 
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import { updateWalletBalance } from '@/lib/storage';

interface CustomerCardProps {
  profile: CustomerProfile;
  onProfileUpdate?: (updated: CustomerProfile) => void;
}

export function CustomerCard({ profile, onProfileUpdate }: CustomerCardProps) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'transfer' | 'card'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleTopUp = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : topUpAmount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const updated = updateWalletBalance(finalAmount);
      setIsProcessing(false);
      setTopUpSuccess(true);
      if (onProfileUpdate) {
        onProfileUpdate(updated);
      }
      setTimeout(() => {
        setTopUpSuccess(false);
        setShowTopUpModal(false);
        setCustomAmount('');
      }, 1400);
    }, 1000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0124891029');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modern Corporate Logistics Account Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-[#0e1420] border border-slate-800/90 p-6 sm:p-7 shadow-xl">
          {/* Top Row: Brand & Pass Tier */}
          <div className="flex items-center justify-between mb-7 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    {profile.tier || 'Enterprise Priority'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">SWIFT PASS</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Swift Logistics Commercial Account
                </h3>
              </div>
            </div>

            {/* Contactless / NFC Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono">
              <span className="text-emerald-400">●</span>
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Center: Naira Wallet Balance */}
          <div className="relative z-10 mb-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Prepaid Logistics Balance
              </span>
              <span className="text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                <span className="text-amber-400 font-bold">{profile.coins?.toLocaleString() || '1,250'}</span> SwiftPoints
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 flex items-baseline gap-2 font-sans tabular-nums">
              <span>₦{(profile.walletBalance || 0).toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400 tracking-normal">NGN</span>
            </div>
          </div>

          {/* Bottom Row: Member Info & Interactive Buttons */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Cardholder & ID
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="font-mono text-xs text-slate-400 mt-0.5">
                {profile.membershipId || 'NG-7842-8920'}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs active:scale-95 transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Top Up Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold active:scale-95 transition-all"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>QR Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Side Stat Tiles */}
        <div className="rounded-2xl bg-[#0e1420] border border-slate-800/90 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cargo Protection Tier</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                ACTIVE
              </span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums font-sans">₦2,500,000</div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Automated transit indemnity guarantee against damage, loss, or road incidents for all priority consignments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-800/80 mt-4">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">In Transit</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums font-sans">
                {profile.activeShipments || 2}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Live GPS Active</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Delivered</div>
              <div className="text-xl font-bold text-white mt-1 tabular-nums font-sans">
                {profile.completedShipments || 18}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">All-time signed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-7 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Top Up Naira Wallet</h3>
                  <p className="text-xs text-slate-400">Instant credit via Nigerian payment rails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Wallet Credited!</h4>
                <p className="text-xs text-slate-400">
                  Your Swift Logistics account balance has been updated instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-5 pt-5">
                {/* Preset Amount Badges */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Top-Up Amount (NGN)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setTopUpAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          topUpAmount === amt && !customAmount
                            ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        ₦{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Or Custom Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      placeholder="Enter custom naira amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Payment Rail Options */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('paystack')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        selectedMethod === 'paystack'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-emerald-400">Paystack</span>
                      <span className="text-[10px] text-slate-400 mt-1">Card / USSD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('transfer')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        selectedMethod === 'transfer'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-amber-400">Bank Transfer</span>
                      <span className="text-[10px] text-slate-400 mt-1">Instant NIP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('card')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        selectedMethod === 'card'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-blue-400">Debit Card</span>
                      <span className="text-[10px] text-slate-400 mt-1">Verve / Master</span>
                    </button>
                  </div>
                </div>

                {selectedMethod === 'transfer' && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Dedicated Virtual Account:</span>
                      <span className="font-bold text-amber-400">Wema Bank / Providus</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">0124891029</span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="font-semibold text-slate-200">Swift Logistics / {profile.firstName}</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleTopUp}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Securing Payment Rail...
                    </>
                  ) : (
                    <>
                      <span>Pay ₦{(customAmount ? parseFloat(customAmount) : topUpAmount).toLocaleString()}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Member Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0f172a] border border-amber-500/30 p-6 shadow-2xl text-center text-slate-100">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-1 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                Priority Gate Pass
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {profile.membershipId || 'NG-7842-8920'}
              </p>
            </div>

            {/* Scannable Pass Box */}
            <div className="mx-auto w-52 h-52 bg-white rounded-2xl p-4 shadow-inner flex flex-col items-center justify-center border-4 border-amber-500/20 relative group">
              <div className="w-full h-full border-2 border-dashed border-slate-800/40 rounded-lg flex flex-col items-center justify-center p-2 bg-slate-50">
                <QrCode className="w-32 h-32 text-slate-900" />
                <span className="text-[9px] font-mono text-slate-600 font-bold tracking-widest mt-1">
                  {profile.membershipId}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 px-2 leading-relaxed">
              Scan at any Swift Logistics 24/7 Smart Locker Hub or present to courier dispatch for instant touchless consignment release.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Authenticated Gold VIP Profile
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerCard;
