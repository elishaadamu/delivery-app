'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Delete, X, AlertCircle } from 'lucide-react';
import { verifyUserPin, setLockStatus } from '@/lib/storage';

interface PinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  allowClose?: boolean;
}

export function PinModal({
  isOpen,
  onSuccess,
  onClose,
  title = 'Security Authentication',
  subtitle = 'Enter your 4-digit PIN to access your account',
  allowClose = true,
}: PinModalProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);
    setError(false);
    setErrorMessage('');

    if (newPin.length === 4) {
      setTimeout(() => {
        const isValid = verifyUserPin(newPin);
        if (isValid) {
          setLockStatus(false);
          onSuccess();
        } else {
          setError(true);
          setErrorMessage('Invalid security PIN. Default demo PIN is 1234');
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-center text-slate-100">
        {allowClose && onClose && (
          <div className="flex justify-end absolute top-5 right-5">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lock Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* 4 Pin Bullets */}
        <div className={`flex justify-center gap-4 my-7 ${error ? 'animate-pulse text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-red-500 border-2 border-red-400'
                    : isFilled
                    ? 'bg-emerald-400 shadow-[0_0_10px_#22c55e] scale-110'
                    : 'bg-slate-800 border-2 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {errorMessage && (
          <div className="mb-4 text-xs text-red-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 text-white font-mono text-xl font-bold transition-all active:scale-95 shadow-sm"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 text-white font-mono text-xl font-bold transition-all active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500">
            Quick Hint: Default Demo PIN is <span className="font-mono text-emerald-400 font-bold">1234</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PinModal;
