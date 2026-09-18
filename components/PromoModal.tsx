'use client';

import React, { useState } from 'react';
import { Gift, X, Sparkles, Check, Copy, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromo?: (code: string) => void;
}

export function PromoModal({ isOpen, onClose, onApplyPromo }: PromoModalProps) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const promoCode = 'SWIFT20';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setApplied(true);
    if (onApplyPromo) {
      onApplyPromo(promoCode);
    }
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0f192e] to-[#090d16] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 text-center text-slate-100 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-end relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Celebratory Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/25 mb-4">
          <div className="w-full h-full bg-[#0b1322] rounded-[14px] flex items-center justify-center text-emerald-400">
            <Gift className="w-8 h-8 animate-bounce" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
        </div>

        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
            VIP Priority Voucher
          </span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            20% Discount Voucher
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Exclusive loyalty voucher for nationwide logistics across Lagos, Abuja, Port Harcourt & Kano.
          </p>
        </div>

        {/* Promo Code Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-dashed border-emerald-500/40 flex items-center justify-between gap-3 relative z-10">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Promo Voucher Code
            </div>
            <div className="font-mono text-xl font-extrabold text-emerald-400 tracking-wider mt-0.5">
              {promoCode}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Benefits list */}
        <div className="mt-5 space-y-2 text-left relative z-10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant 20% discount (saves up to ₦3,000 on delivery)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Applies to Intra-City and Interstate trunk shipments</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automatic full ₦2.5M cargo transit protection retained</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 relative z-10">
          <button
            type="button"
            onClick={handleApply}
            disabled={applied}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {applied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Promo Applied Successfully!</span>
              </>
            ) : (
              <>
                <span>Apply Promo to Active Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromoModal;
