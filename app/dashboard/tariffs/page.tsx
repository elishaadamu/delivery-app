'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import {
  Calculator,
  Truck,
  Plane,
  Zap,
  ShieldCheck,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react';

const CITIES = [
  'Lagos (Ikeja / Lekki / VI)',
  'Abuja (Wuse / Maitama / Garki)',
  'Port Harcourt (Trans-Amadi / GRA)',
  'Kano (Commercial / Airport)',
  'Ibadan (Bodija / Ring Road)',
  'Enugu (Independence Layout)',
  'Kaduna (Central Distribution)',
];

const ROUTE_MATRIX = [
  { origin: 'Lagos Hub 01 (Ikeja)', destination: 'Abuja Central (Maitama)', ground: '₦8,500', air: '₦18,000', sla: 'Next-Day Air / 48h Ground' },
  { origin: 'Lagos Hub 02 (Lekki)', destination: 'Port Harcourt (GRA)', ground: '₦9,200', air: '₦19,500', sla: 'Next-Day Air / 48h Ground' },
  { origin: 'Abuja Central (Wuse)', destination: 'Kano Commercial Hub', ground: '₦6,500', air: '₦15,000', sla: 'Same-Day / Next-Day' },
  { origin: 'Lagos Hub 01 (Ikeja)', destination: 'Ibadan Ring Road Depot', ground: '₦4,500', air: 'N/A Ground Only', sla: '4-6 Hours Dedicated' },
  { origin: 'Port Harcourt (GRA)', destination: 'Enugu Distribution Hub', ground: '₦5,800', air: '₦16,000', sla: '24-36 Hours' },
];

export default function TariffsPage() {
  const { setIsBookModalOpen } = useDashboard();

  const [origin, setOrigin] = useState('Lagos (Ikeja / Lekki / VI)');
  const [destination, setDestination] = useState('Abuja (Wuse / Maitama / Garki)');
  const [weight, setWeight] = useState<number>(4.5);
  const [serviceType, setServiceType] = useState<'ground' | 'air' | 'same-day'>('air');
  const [includeInsurance, setIncludeInsurance] = useState(true);

  // Pricing configuration
  const pricingConfig = {
    ground: { base: 8500, perKg: 950, name: 'Standard Interstate Ground', days: '2-3 Business Days', icon: Truck },
    air: { base: 18000, perKg: 1800, name: 'Air Freight Priority Express', days: 'Next-Day Delivery', icon: Plane },
    'same-day': { base: 25000, perKg: 2400, name: 'Same-Day Dedicated Courier', days: '4-6 Hours Express', icon: Zap },
  };

  const selectedConfig = pricingConfig[serviceType];
  const freightCost = selectedConfig.base + Math.round(weight * selectedConfig.perKg);
  const insuranceCost = includeInsurance ? 1500 : 0;
  const vat = Math.round((freightCost + insuranceCost) * 0.075);
  const total = freightCost + insuranceCost + vat;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Logistics Tariffs & Rate Calculator
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold font-mono shrink-0">
            Official FIRS 2026 Rates
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Transparent interstate shipping quotes across Nigeria. Instant calculation with zero hidden fuel charges.
        </p>
      </div>

      {/* Main Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Route & Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Calculate Consignment Tariff
            </h2>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Origin Depot / City
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500/80"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Destination Hub / City
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500/80"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Billable Weight
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                {weight.toFixed(1)} KG
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={50}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.5 KG <span className="hidden sm:inline">(Doc)</span></span>
              <span>15 KG <span className="hidden sm:inline">(Box)</span></span>
              <span>30 KG <span className="hidden sm:inline">(Crate)</span></span>
              <span>50 KG <span className="hidden sm:inline">(Freight)</span></span>
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Transit Priority Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'ground', label: 'Interstate Ground', days: '2-3 Days', icon: Truck },
                  { id: 'air', label: 'Air Priority', days: 'Next-Day', icon: Plane },
                  { id: 'same-day', label: 'Same-Day Direct', days: '4-6 Hours', icon: Zap },
                ] as const
              ).map((tier) => {
                const Icon = tier.icon;
                const isSelected = serviceType === tier.id;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setServiceType(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-xs font-semibold">{tier.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tier.days}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cargo Protection Add-on */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate sm:text-clip">
                  ₦2.5M Transit Indemnity Guarantee
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  Full replacement value compensation (+₦1,500)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncludeInsurance(!includeInsurance)}
              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                includeInsurance
                  ? 'bg-emerald-500 border-emerald-400 text-black'
                  : 'bg-slate-800 border-slate-700 text-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right Summary: Itemized Quote & Dispatch CTA (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-xl">
          <div>
            <div className="pb-4 border-b border-slate-800/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Official Cost Breakdown
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Estimated Shipping Fare
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedConfig.name} • {selectedConfig.days}
              </p>
            </div>

            {/* Line items */}
            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Trunk Fare</span>
                <span className="font-sans font-semibold tabular-nums text-white">
                  ₦{selectedConfig.base.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weight Surcharge ({weight.toFixed(1)}kg @ ₦{selectedConfig.perKg}/kg)</span>
                <span className="font-sans font-semibold tabular-nums text-white">
                  ₦{Math.round(weight * selectedConfig.perKg).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cargo Indemnity Protection</span>
                <span className="font-sans font-semibold tabular-nums text-white">
                  {includeInsurance ? '₦1,500' : '₦0 (Declined)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Value Added Tax (VAT 7.5%)</span>
                <span className="font-sans font-semibold tabular-nums text-white">
                  ₦{vat.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">Total Net Amount</div>
              <div className="text-3xl font-extrabold text-white tracking-tight mt-1 font-sans tabular-nums">
                ₦{total.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 tracking-normal">
                  NGN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rate locked for 48 hours. Fuel surcharges included.</span>
              </p>
            </div>
          </div>

          {/* Book Dispatch CTA */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Book This Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Popular Corridors Rate Matrix Table */}
      <div className="bg-[#0e1420] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Popular Interstate Cargo Corridors
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard baseline rates for parcels up to 5.0 KG on major regional transport routes.
          </p>
        </div>

        {/* Mobile Route Cards (Visible on screens < sm) */}
        <div className="block sm:hidden space-y-3">
          {ROUTE_MATRIX.map((row, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="truncate">{row.origin}</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="text-emerald-400 truncate">{row.destination}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ground Freight</span>
                  <span className="font-sans font-bold text-white tabular-nums">{row.ground}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Air Priority</span>
                  <span className="font-sans font-bold text-emerald-400 tabular-nums">{row.air}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/50">
                SLA: {row.sla}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (Visible on sm+) */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transit Route</th>
                <th className="py-3 px-4">Destination Hub</th>
                <th className="py-3 px-4">Ground Freight</th>
                <th className="py-3 px-4">Air Priority</th>
                <th className="py-3 px-4">Standard SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {ROUTE_MATRIX.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{row.origin}</td>
                  <td className="py-3.5 px-4 text-slate-300">{row.destination}</td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-white tabular-nums">{row.ground}</td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-emerald-400 tabular-nums">{row.air}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{row.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
