'use client';

import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertCircle, Sparkles, Package } from 'lucide-react';
import { mockPackages } from '@/lib/mockData';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (orderId: string) => void;
}

export function ScannerModal({ isOpen, onClose, onSelectOrder }: ScannerModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [scannedPackage, setScannedPackage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScanCode = (code: string) => {
    setErrorMsg('');
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const matched = mockPackages.find(
        (p) => p.id.toLowerCase() === code.trim().toLowerCase()
      );
      if (matched) {
        setScannedPackage(matched.id);
        setTimeout(() => {
          onSelectOrder(matched.id);
          onClose();
          setScannedPackage(null);
          setManualCode('');
        }, 900);
      } else {
        setErrorMsg(`Waybill "${code}" not found in national registry.`);
      }
    }, 800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Digital Cargo Scanner</h3>
              <p className="text-xs text-slate-400">Scan Swift QR or Waybill Barcode</p>
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

        {/* Scanner Viewport with sweeping laser */}
        <div className="mt-5 relative w-full h-64 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Scanner Reticle Frame */}
          <div className="relative w-56 h-44 rounded-xl border border-dashed border-emerald-500/50 flex items-center justify-center">
            {/* 4 Corner Markers */}
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />

            {/* Sweeping Laser Line */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#22c55e]"
              style={{ animation: 'scan-laser 2.2s ease-in-out infinite' }}
            />

            {/* Central Target Status */}
            {scannedPackage ? (
              <div className="flex flex-col items-center gap-1.5 bg-slate-900/90 border border-emerald-500/60 px-4 py-2 rounded-xl text-emerald-400 animate-pulse">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs font-mono font-bold">{scannedPackage}</span>
              </div>
            ) : scanning ? (
              <div className="flex flex-col items-center gap-1 text-slate-300">
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-mono">Decoding telemetry...</span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider">
                Align code within reticle
              </span>
            )}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Interactive Sample Barcodes / Quick Scan Tap */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Tap Sample Nigerian Waybill to Test Scan:
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Mock Data
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mockPackages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handleScanCode(pkg.id)}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    {pkg.id}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {pkg.weightKg}kg
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate mt-0.5">
                  {pkg.itemDescription}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Waybill Input */}
        <form onSubmit={handleManualSubmit} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. SW-LAG-9428"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            Lookup
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScannerModal;
