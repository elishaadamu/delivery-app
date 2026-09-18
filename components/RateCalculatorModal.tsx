'use client';

import React, { useState } from 'react';
import { Calculator, X, ShieldCheck, ArrowRight, Check, Zap, Truck, Plane } from 'lucide-react';

interface RateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedBooking?: (quote: { origin: string; destination: string; weight: number; service: string; total: number }) => void;
}

const CITIES = [
  'Lagos (Ikeja / Lekki / VI)',
  'Abuja (Wuse / Maitama / Garki)',
  'Port Harcourt (Trans-Amadi / GRA)',
  'Kano (Commercial / Airport)',
  'Ibadan (Bodija / Ring Road)',
  'Enugu (Independence Layout)',
  'Kaduna (Central Distribution)',
];

export function RateCalculatorModal({ isOpen, onClose, onProceedBooking }: RateCalculatorModalProps) {
  const [origin, setOrigin] = useState('Lagos (Ikeja / Lekki / VI)');
  const [destination, setDestination] = useState('Abuja (Wuse / Maitama / Garki)');
  const [weight, setWeight] = useState<number>(3.5);
  const [serviceType, setServiceType] = useState<'ground' | 'air' | 'same-day'>('air');
  const [includeInsurance, setIncludeInsurance] = useState(true);

  if (!isOpen) return null;

  // Base pricing
  const pricingConfig = {
    ground: { base: 8500, perKg: 950, name: 'Standard Interstate Ground', days: '2-3 Days', icon: Truck },
    air: { base: 18000, perKg: 1800, name: 'Air Freight Priority Express', days: 'Next Day', icon: Plane },
    'same-day': { base: 25000, perKg: 2400, name: 'Same-Day Dedicated Courier', days: '4-6 Hours', icon: Zap },
  };

  const selectedConfig = pricingConfig[serviceType];
  const freightCost = selectedConfig.base + Math.round(weight * selectedConfig.perKg);
  const insuranceCost = includeInsurance ? 1500 : 0;
  const vat = Math.round((freightCost + insuranceCost) * 0.075);
  const total = freightCost + insuranceCost + vat;

  const handleProceed = () => {
    if (onProceedBooking) {
      onProceedBooking({
        origin,
        destination,
        weight,
        service: selectedConfig.name,
        total,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Logistics Tariff Calculator</h3>
              <p className="text-xs text-slate-400">Transparent Nigerian Nationwide Freight Rates</p>
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

        <div className="mt-5 space-y-5">
          {/* Route origin & destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Origin City / Hub
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Destination City / Hub
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Consignment Weight (KG)
              </label>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {weight} KG
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.5 KG (Documents)</span>
              <span>25 KG (Heavy Freight)</span>
              <span>50 KG (Pallet)</span>
            </div>
          </div>

          {/* Service Level Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Dispatch Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ground', 'air', 'same-day'] as const).map((key) => {
                const conf = pricingConfig[key];
                const Icon = conf.icon;
                const isSelected = serviceType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setServiceType(key)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">
                        {key === 'ground' ? 'Standard Ground' : key === 'air' ? 'Air Freight' : 'Same-Day VIP'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{conf.days}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transit Insurance Toggle */}
          <div 
            onClick={() => setIncludeInsurance(!includeInsurance)}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  ₦2,500,000 Cargo Transit Protection
                </div>
                <div className="text-[10px] text-slate-400">
                  Comprehensive coverage against loss, theft or physical damage
                </div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              includeInsurance ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-700 bg-slate-800'
            }`}>
              {includeInsurance && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Quote breakdown box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Freight Rate ({weight}kg):</span>
              <span>₦{freightCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Transit Insurance:</span>
              <span>₦{insuranceCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>FIRS Statutory VAT (7.5%):</span>
              <span>₦{vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 font-bold text-white text-sm">
              <span>Estimated Total:</span>
              <span className="text-xl font-extrabold text-emerald-400">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Lock Rate & Book Consignment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateCalculatorModal;
