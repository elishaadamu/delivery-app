'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OrderTrackingCard from '@/components/dashboard/OrderTrackingCard';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import BookDeliveryModal from '@/components/dashboard/BookDeliveryModal';
import ChatSupportWidget from '@/components/dashboard/ChatSupportWidget';
import {
  DeliveryOrder,
  DeliveryStatus,
  CustomerProfile,
} from '@/types/delivery';
import { initialCustomerProfile, sampleOrders } from '@/lib/mockData';
import {
  Truck,
  ShieldCheck,
  Clock,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const isNewUser = searchParams?.get('new_user') === 'true';

  // Customer Profile
  const [user, setUser] = useState<CustomerProfile>(initialCustomerProfile);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(isNewUser);

  // Orders state
  const [orders, setOrders] = useState<DeliveryOrder[]>(sampleOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(sampleOrders[0].id);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportInitialPrompt, setSupportInitialPrompt] = useState<string | undefined>(undefined);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

  // Load registered user from localStorage if present
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('swiftdrop_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.firstName) {
            setUser(parsed);
            setShowWelcomeBanner(true);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const activeCount = orders.filter((o) => o.status !== 'delivered').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const handleStatusChange = (orderId: string, newStatus: DeliveryStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: newStatus,
        };
      })
    );

    const statusNames: Record<DeliveryStatus, string> = {
      confirmed: 'Confirmed Order',
      in_transit: 'In Transit',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    };

    setToastMessage(`Status updated: ${statusNames[newStatus]}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleOrderCreated = (newOrder: DeliveryOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setActiveTab('overview');
    setToastMessage(`Order created: ${newOrder.trackingNumber}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectOrder = (order: DeliveryOrder) => {
    setSelectedOrderId(order.id);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorder = () => {
    setIsBookModalOpen(true);
  };

  const handleOpenChatSupport = (prompt?: string) => {
    setSupportInitialPrompt(prompt);
    setIsSupportOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between pb-24">
      
      {/* Top Header */}
      <DashboardHeader
        user={user}
        activeTab={activeTab}
        setActiveTab={(t: string) => setActiveTab(t === 'orders' ? 'orders' : 'overview')}
        onOpenBookDelivery={() => setIsBookModalOpen(true)}
        activeOrdersCount={activeCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-5">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-5 z-50 p-3 rounded-lg bg-gray-900 text-white text-xs font-semibold shadow-md flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Welcome Banner for Newly Registered Customers */}
        {showWelcomeBanner && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Welcome, {user.firstName}!
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Your customer account is ready. Book a new delivery or view your shipment statuses below.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                + Book Delivery
              </button>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Summary Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                Active Shipments
              </span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {activeCount}
            </div>
            <span className="text-[11px] text-gray-500">In transit or out for delivery</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                Completed
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {deliveredCount}
            </div>
            <span className="text-[11px] text-gray-500">Delivered with proof</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                On-Time Rate
              </span>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              99.4%
            </div>
            <span className="text-[11px] text-gray-500">Express delivery guarantee</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                Support
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              Available 24/7
            </div>
            <span className="text-[11px] text-gray-500">WhatsApp & In-App Chat</span>
          </div>

        </div>

        {/* Tab 1: Overview & Active Tracking */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            
            {/* Active Order Tracking Component */}
            {activeOrder && (
              <OrderTrackingCard
                order={activeOrder}
                onStatusChange={handleStatusChange}
                onOpenChatSupport={handleOpenChatSupport}
              />
            )}

            {/* Quick Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white border border-gray-200">
              <div className="text-xs text-gray-600">
                Ready to dispatch another parcel or urgent document?
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Delivery</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex-1 sm:flex-initial py-1.5 px-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
                >
                  View All Orders &rarr;
                </button>
              </div>
            </div>

            {/* Recent Orders List Summary */}
            <RecentOrdersTable
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={handleSelectOrder}
              onReorder={handleReorder}
            />
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <RecentOrdersTable
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={handleSelectOrder}
              onReorder={handleReorder}
            />
          </div>
        )}

      </main>

      {/* Book Delivery Modal */}
      <BookDeliveryModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        user={user}
        onOrderCreated={handleOrderCreated}
      />

      {/* Chat Support & WhatsApp Floating Widget */}
      <ChatSupportWidget
        activeOrder={activeOrder}
        isOpen={isSupportOpen}
        onToggle={() => setIsSupportOpen(!isSupportOpen)}
        initialMessagePrompt={supportInitialPrompt}
      />

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600 text-sm">Loading SwiftDrop Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
