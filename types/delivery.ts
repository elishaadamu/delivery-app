export type DeliveryStatus = 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
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
  category: 'documents' | 'small_box' | 'medium_box' | 'cargo';
  weight: number; // in kg
  description: string;
  isFragile: boolean;
  requiresSignature: boolean;
}

export interface PaymentDetails {
  method: 'card' | 'apple_pay' | 'bank_transfer' | 'cod';
  baseFare: number;
  distanceFare: number;
  weightFare: number;
  insurance: number;
  discount: number;
  total: number;
  promoCode?: string;
  cardNumberMasked?: string;
}

export interface TimelineEvent {
  status: DeliveryStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicleModel: string;
  vehiclePlate: string;
  currentLocationName: string;
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
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}
