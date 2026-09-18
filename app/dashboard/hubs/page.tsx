'use client';

import React, { useState } from 'react';
import { mockHubs } from '@/lib/mockData';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Search,
  Navigation,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Boxes,
} from 'lucide-react';

export default function HubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredHubs = mockHubs.filter((hub) => {
    const matchesSearch =
      hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || hub.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Nationwide Hubs & 24/7 Smart Lockers
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold font-mono shrink-0">
            {mockHubs.length} Active Stations
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pick up and drop off priority packages anytime. Secure automated lockers and staffed distribution centres.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e1420] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by hub name, district, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Lagos', 'Abuja', 'Port Harcourt'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-black shadow-sm font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hubs Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredHubs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No distribution stations found matching &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredHubs.map((hub) => (
            <div
              key={hub.id}
              className="p-5 rounded-2xl bg-[#0e1420] border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-xl space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    {hub.city}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {hub.id}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {hub.name}
                </h3>

                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-400">{hub.hours || '24/7 Automated Locker Access'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-400">{hub.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Lockers Available</span>
                </span>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(hub.address + ', ' + hub.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium hover:underline"
                >
                  <span>Directions</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contactless Smart Locker Explainer Guide */}
      <div className="bg-[#0e1420] border border-slate-800/90 rounded-2xl p-4 sm:p-7 shadow-xl space-y-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            How Contactless Pickup Works
          </span>
          <h2 className="text-base font-bold text-white mt-1">
            24/7 Self-Service Smart Lockers in 3 Easy Steps
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Never miss a home delivery again. Pick up your parcel on your schedule, day or night.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Select Smart Locker</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When booking a dispatch, choose any nearby locker station as your designated delivery address.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Receive SMS OTP Code</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once our courier deposits the package, you instantly receive a secure 6-digit PIN via SMS and email.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Tap & Collect 24/7</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Touch the station screen, enter your PIN, and the door pops open automatically. Signed and done.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
