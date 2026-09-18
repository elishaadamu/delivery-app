'use client';

import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';
import { mockHubs } from '@/lib/mockData';

interface HubsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HubsModal({ isOpen, onClose }: HubsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  if (!isOpen) return null;

  const filteredHubs = mockHubs.filter((hub) => {
    const matchesSearch =
      hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || hub.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hubs & 24/7 Smart Lockers</h3>
              <p className="text-xs text-slate-400">Nationwide Express Distribution Network</p>
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

        {/* Search & City Filter */}
        <div className="mt-4 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hub name, street, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Lagos', 'Abuja', 'Port Harcourt'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Hubs Listing */}
        <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1">
          {filteredHubs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hubs matching your query. Try searching &quot;Lekki&quot; or &quot;Abuja&quot;.
            </div>
          ) : (
            filteredHubs.map((hub) => (
              <div
                key={hub.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {hub.city}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{hub.name}</h4>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hub.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 active:scale-95 transition-all shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{hub.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-emerald-400 font-medium">{hub.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-300">{hub.phone}</span>
                  </div>
                </div>

                {hub.features && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {hub.features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HubsModal;
