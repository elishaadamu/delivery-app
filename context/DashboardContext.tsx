'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerProfile, DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import { initialCustomerProfile, sampleOrders, getSavedPackages, saveOrdersData } from '@/lib/mockData';
import { getUserSession, getLockStatus, setLockStatus, setUserSession } from '@/lib/storage';

interface DashboardContextType {
  user: CustomerProfile;
  setUser: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  activeOrdersCount: number;
  isLoading: boolean;
  isLocked: boolean;
  isBookModalOpen: boolean;
  setIsBookModalOpen: (open: boolean) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
  supportInitialPrompt?: string;
  openSupportWithPrompt: (prompt?: string) => void;
  toastMessage: string;
  showToast: (msg: string) => void;
  handleStatusChange: (orderId: string, newStatus: DeliveryStatus) => void;
  handleOrderCreated: (newOrder: DeliveryOrder) => void;
  handleOrderPaid: (orderId: string) => void;
  triggerLock: () => void;
  unlockSession: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [user, setUser] = useState<CustomerProfile>(initialCustomerProfile);
  const [orders, setOrders] = useState<DeliveryOrder[]>(sampleOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(sampleOrders[0].id);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportInitialPrompt, setSupportInitialPrompt] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      const storedUser = getUserSession();
      if (storedUser) {
        setUser(storedUser);
      }
      const storedOrders = getSavedPackages();
      if (storedOrders && storedOrders.length > 0) {
        setOrders(storedOrders);
        setSelectedOrderId(storedOrders[0].id);
      }
      if (getLockStatus()) {
        setIsLocked(true);
        setIsPinModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load dashboard storage data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleStatusChange = (orderId: string, newStatus: DeliveryStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.trackingNumber === orderId) {
        return {
          ...ord,
          status: newStatus,
          timeline: ord.timeline.map((evt) => {
            if (evt.status === newStatus) {
              return { ...evt, completed: true, current: true };
            }
            return evt;
          }),
        };
      }
      return ord;
    });

    setOrders(updated);
    saveOrdersData(updated);
    showToast(`Waybill status updated to ${newStatus.toUpperCase()}`);
  };

  const handleOrderCreated = (newOrder: DeliveryOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveOrdersData(updated);
    setSelectedOrderId(newOrder.id);
    showToast(`Waybill ${newOrder.trackingNumber} successfully generated!`);
  };

  const handleOrderPaid = (orderId: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.trackingNumber === orderId) {
        return {
          ...ord,
          payment: {
            ...ord.payment,
            isPaid: true,
            paidDate: 'Just now',
          },
        };
      }
      return ord;
    });
    setOrders(updated);
    saveOrdersData(updated);
    showToast('Payment settled and digital tax invoice generated!');
  };

  const triggerLock = () => {
    setIsLocked(true);
    setLockStatus(true);
    setIsPinModalOpen(true);
  };

  const unlockSession = () => {
    setIsLocked(false);
    setLockStatus(false);
    setIsPinModalOpen(false);
    showToast('Account successfully unlocked!');
  };

  const openSupportWithPrompt = (prompt?: string) => {
    if (prompt) {
      setSupportInitialPrompt(prompt);
    }
    setIsSupportOpen(true);
  };

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <DashboardContext.Provider
      value={{
        user,
        setUser: (updater) => {
          setUser((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            setUserSession(next);
            return next;
          });
        },
        orders,
        setOrders,
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
        openSupportWithPrompt,
        toastMessage,
        showToast,
        handleStatusChange,
        handleOrderCreated,
        handleOrderPaid,
        triggerLock,
        unlockSession,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
