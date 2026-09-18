import { CustomerProfile } from '@/types/delivery';
import { initialCustomerProfile } from './mockData';

const STORAGE_KEYS = {
  USER_SESSION: '@swift_user_session',
  USER_PIN: '@swift_user_pin',
  IS_LOCKED: '@swift_is_locked',
  REGISTERED_USERS: '@swift_registered_users',
};

export function getUserSession(): CustomerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read user session', err);
    return null;
  }
}

export function setUserSession(profile: CustomerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user session', err);
  }
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    localStorage.removeItem(STORAGE_KEYS.IS_LOCKED);
  } catch (err) {
    console.error('Failed to clear user session', err);
  }
}

export function getUserPin(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_PIN) || '1234';
  } catch {
    return '1234';
  }
}

export function setUserPin(pin: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PIN, pin);
  } catch (err) {
    console.error('Failed to save user pin', err);
  }
}

export function verifyUserPin(pin: string): boolean {
  const current = getUserPin();
  // Default accepted demo pin is 1234
  return pin === (current || '1234');
}

export function getLockStatus(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_LOCKED) === 'true';
  } catch {
    return false;
  }
}

export function setLockStatus(isLocked: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOCKED, isLocked ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to set lock status', err);
  }
}

export function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pin?: string;
  address?: string;
}): CustomerProfile {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const profile: CustomerProfile = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    membershipId: 'NG-7842-' + randomSuffix,
    tier: 'Gold VIP',
    walletBalance: 25000, // ₦25,000 welcome bonus credit
    coins: 500,
    activeShipments: 1,
    completedShipments: 0,
    address: data.address || 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos State',
    pin: data.pin || '1234',
  };

  setUserSession(profile);
  if (data.pin) {
    setUserPin(data.pin);
  }
  return profile;
}

export function updateWalletBalance(amountToAdd: number): CustomerProfile {
  const current = getUserSession() || initialCustomerProfile;
  const updated: CustomerProfile = {
    ...current,
    walletBalance: (current.walletBalance || 0) + amountToAdd,
  };
  setUserSession(updated);
  return updated;
}

export function updateCustomerProfile(updates: Partial<CustomerProfile>): CustomerProfile {
  const current = getUserSession() || initialCustomerProfile;
  const updated: CustomerProfile = {
    ...current,
    ...updates,
  };
  setUserSession(updated);
  return updated;
}
