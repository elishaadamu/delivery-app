'use client';

import React, { useState } from 'react';
import { mockFaqs } from '@/lib/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Headphones,
  FileText,
} from 'lucide-react';

export default function ProtectionPage() {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const whatsappNumber = '2348034567890';
  const claimText = encodeURIComponent('Hello Swift Logistics Claims Desk. I would like to initiate a cargo indemnity report.');
  const claimUrl = `https://wa.me/${whatsappNumber}?text=${claimText}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cargo Protection & Transit Indemnity
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold font-mono shrink-0">
            ₦2.5M Standard Coverage
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Full automatic transit indemnification against transit loss, physical damage, or highway incidentals.
        </p>
      </div>

      {/* Main Coverage Hero Card */}
      <div className="p-4 sm:p-8 rounded-2xl bg-[#0e1420] border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Automated Transit Indemnity Guarantee</span>
        </div>
        <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans tabular-nums">
          ₦2,500,000 Coverage Included
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Every consignment booked with Swift Logistics across Lagos, Abuja, Port Harcourt, and nationwide corridors is automatically covered under our comprehensive cargo policy. In the unlikely event of transit accidents, damage, or logistical shortfall, verified claims are settled in full within 5 business days.
        </p>
        <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            ✓ Zero Deductible on Priority Items
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            ✓ GPS Tamper-Evident Geofence
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            ✓ Instant Photo Telemetry
          </span>
        </div>
      </div>

      {/* Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0e1420] border border-slate-800/80 shadow-xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Guaranteed Transit SLAs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Intra-city intra-state dispatch delivered within 2 to 4 hours. Priority interstate air freight reaches destination hubs next-day.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1420] border border-slate-800/80 shadow-xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Digital Proof of Delivery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every handover requires a 4-digit recipient PIN or biometric e-signature before courier release, eliminating fraudulent dropoffs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1420] border border-slate-800/80 shadow-xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Prohibited Cargo Policy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Firearms, contraband, illicit substances, hazardous liquids, and uncertified bulk cash are strictly prohibited under federal transport laws.
          </p>
        </div>
      </div>

      {/* Claims Process & FAQ Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step-by-Step Claim Process (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">How to File a Transit Claim</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Straightforward 3-step reimbursement workflow.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <strong className="text-white block">Notify within 24 Hours</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Report any packaging damage, missing items, or delivery discrepancies via our claims concierge.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <strong className="text-white block">Submit Photos & Invoice</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Provide waybill number, original purchase receipt, and clear photos of the damaged consignment.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <strong className="text-white block">Settlement in 5 Days</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Our cargo underwriting desk completes review and credits your Swift Logistics wallet or commercial bank account.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <a
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              <span>Contact Claims Concierge</span>
            </a>
          </div>
        </div>

        {/* FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Everything you need to know about Swift Logistics insurance and compliance.
            </p>
          </div>

          <div className="space-y-2.5">
            {mockFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-slate-900/90 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : (faq.id || null))}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-slate-400 border-t border-slate-800/50 mt-1 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
