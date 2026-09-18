export type DeliveryStatus = 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'pending';

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  membershipId?: string;
  tier?: string;
  walletBalance?: number;
  coins?: number;
  activeShipments?: number;
  completedShipments?: number;
  address?: string;
  pin?: string;
}

export interface SenderDetails {
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  pickupTimeWindow: string;
  pickupNotes?: string;
}

export interface ReceiverDetails {
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export interface PackageDetails {
  category: 'documents' | 'small_box' | 'medium_box' | 'cargo' | string;
  weight: number; // in kg
  description: string;
  isFragile: boolean;
  requiresSignature: boolean;
  dimensions?: string;
}

export interface PaymentDetails {
  method: 'card' | 'apple_pay' | 'bank_transfer' | 'cod' | 'paystack' | 'wallet' | string;
  baseFare: number;
  distanceFare: number;
  weightFare: number;
  insurance: number;
  discount: number;
  total: number;
  vat?: number;
  isPaid?: boolean;
  paidDate?: string;
  promoCode?: string;
  cardNumberMasked?: string;
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
}

export interface TimelineEvent {
  status: DeliveryStatus | string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicleModel: string;
  vehiclePlate: string;
  currentLocationName: string;
  avatarUrl?: string;
}

export interface DeliveryOrder {
  id: string;
  trackingNumber: string;
  status: DeliveryStatus;
  createdAt: string;
  estimatedDelivery: string;
  sender: SenderDetails;
  receiver: ReceiverDetails;
  packageInfo: PackageDetails;
  payment: PaymentDetails;
  driver?: DriverInfo;
  timeline: TimelineEvent[];

  // Compatibility helpers
  itemDescription?: string;
  weightKg?: number;
  originAddress?: string;
  destinationAddress?: string;
  packageCategory?: string;
  paymentDetails?: PaymentDetails;
  trackingSteps?: TimelineEvent[];
}

export interface LogisticsHub {
  id: string;
  name: string;
  type?: 'hub' | 'locker' | 'express';
  typeLabel?: string;
  city: string;
  address: string;
  state?: string;
  hours?: string;
  openingHours?: string;
  phone: string;
  distance?: string;
  capacityStatus?: 'Available' | 'High Traffic' | 'Full';
  features?: string[];
  coordinates?: { lat: number; lng: number };
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system' | 'driver' | 'customer';
  text: string;
  timestamp: string;
}
