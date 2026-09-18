'use client';

import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BookDeliveryModal from '@/components/dashboard/BookDeliveryModal';
import ScannerModal from '@/components/ScannerModal';
import PinModal from '@/components/PinModal';
import ChatSupportWidget from '@/components/dashboard/ChatSupportWidget';
import DashboardSkeleton from '@/components/SkeletonLoader';
import { Sparkles } from 'lucide-react';

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const {
    user,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    activeOrdersCount,
    isLoading,
    isLocked,
    isBookModalOpen,
    setIsBookModalOpen,
    isScannerOpen,
    setIsScannerOpen,
    isPinModalOpen,
    setIsPinModalOpen,
    isSupportOpen,
    setIsSupportOpen,
    supportInitialPrompt,
    toastMessage,
    handleOrderCreated,
    unlockSession,
    triggerLock,
  } = useDashboard();

  const selectedOrder =
    orders.find((o) => o.id === selectedOrderId || o.trackingNumber === selectedOrderId) ||
    orders[0];

  const handleSelectOrderFromScanner = (waybillCode: string) => {
    const matched = orders.find(
      (o) =>
        o.id.toLowerCase() === waybillCode.toLowerCase() ||
        o.trackingNumber.toLowerCase() === waybillCode.toLowerCase()
    );
    if (matched) {
      setSelectedOrderId(matched.id);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative">
      {/* Persistent App Header */}
      <DashboardHeader
        user={user}
        onOpenBookDelivery={() => setIsBookModalOpen(true)}
        onTriggerLock={triggerLock}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Content View with generous bottom padding so floating controls never obscure table rows */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 overflow-x-hidden">
        {children}
      </main>

      {/* Floating Concierge Chat Support */}
      <ChatSupportWidget
        activeOrder={selectedOrder}
        isOpen={isSupportOpen}
        onToggle={() => setIsSupportOpen(!isSupportOpen)}
        initialMessagePrompt={supportInitialPrompt}
      />

      {/* Global Modals */}
      <BookDeliveryModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        user={user}
        onOrderCreated={handleOrderCreated}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectOrder={handleSelectOrderFromScanner}
      />

      <PinModal
        isOpen={isPinModalOpen}
        onSuccess={unlockSession}
        onClose={isLocked ? undefined : () => setIsPinModalOpen(false)}
        allowClose={!isLocked}
        title="Security Unlock"
        subtitle="Enter your 4-digit PIN to access this session"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardProvider>
  );
}
