'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle2, Phone } from 'lucide-react';
import { mockFaqs } from '@/lib/mockData';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cargo Protection & Policies</h3>
              <p className="text-xs text-slate-400">Swift Logistics Guarantee & Customer Protection</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Main Guarantee Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Transit Indemnity Guarantee</span>
            </div>
            <div className="text-2xl font-extrabold text-white">₦2,500,000 Coverage</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Every package booked with Swift Logistics is automatically protected against physical damage, loss, or road incidents across all 36 Nigerian states and Abuja FCT.
            </p>
          </div>

          {/* Key Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>Transit Guarantees</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Intra-City Lagos & Abuja: 2 to 4 hours. Regional Hub Interstate: Next-Day. Standard Nationwide: 48-72 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Prohibited Cargo</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Firearms, explosive chemicals, hazardous batteries, illicit substances, perishable fresh foods without cold packaging.
              </p>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {mockFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : (faq.id || null))}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-200 hover:text-white"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Concierge */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Need Support or Have a Claim?</div>
              <div className="text-[11px] text-slate-400">Our 24/7 concierge is available in Lagos & Abuja</div>
            </div>
            <a
              href="tel:+2348007943853"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
