import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-16 animate-pulse-subtle">
      {/* Header Skeleton */}
      <div className="border-b border-[#1e293b]/70 bg-[#0f172a]/90 backdrop-blur px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80" />
            <div className="space-y-2">
              <div className="w-36 h-4 rounded bg-slate-800" />
              <div className="w-24 h-3 rounded bg-slate-800/60" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-9 rounded-xl bg-slate-800/70" />
            <div className="w-10 h-10 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Customer Card & Stats Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-2xl bg-slate-850 border border-slate-800/80 p-6 relative overflow-hidden">
            <div className="w-48 h-6 rounded bg-slate-800 mb-4" />
            <div className="w-32 h-4 rounded bg-slate-800/60 mb-8" />
            <div className="w-56 h-10 rounded bg-slate-800 mb-6" />
            <div className="flex gap-4">
              <div className="w-28 h-10 rounded-xl bg-slate-800" />
              <div className="w-28 h-10 rounded-xl bg-slate-800/60" />
            </div>
          </div>
          <div className="h-64 rounded-2xl bg-slate-850 border border-slate-800/80 p-6 space-y-4">
            <div className="w-36 h-5 rounded bg-slate-800" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-20 rounded-xl bg-slate-800/70" />
              <div className="h-20 rounded-xl bg-slate-800/70" />
              <div className="h-20 rounded-xl bg-slate-800/70" />
              <div className="h-20 rounded-xl bg-slate-800/70" />
            </div>
          </div>
        </div>

        {/* Quick Action Chips Skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-11 w-36 rounded-xl bg-slate-850 border border-slate-800 shrink-0" />
          ))}
        </div>

        {/* Tracking Card Skeleton */}
        <div className="rounded-2xl bg-slate-850 border border-slate-800/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="w-48 h-6 rounded bg-slate-800" />
              <div className="w-32 h-4 rounded bg-slate-800/60" />
            </div>
            <div className="w-40 h-10 rounded-xl bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-800/60" />
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl bg-slate-850 border border-slate-800/80 p-6 space-y-4">
          <div className="w-44 h-6 rounded bg-slate-800" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-800/50" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardSkeleton;
