import { DeliveryOrder, CustomerProfile, DriverInfo, ChatMessage, LogisticsHub, FaqItem } from '@/types/delivery';

export const initialCustomerProfile: CustomerProfile = {
  firstName: 'Elisha',
  lastName: 'Adamu',
  phone: '+234 803 456 7890',
  email: 'elisha.adamu@swiftlogistics.ng',
  membershipId: 'NG-7842-8920',
  tier: 'Gold VIP',
  walletBalance: 45500,
  coins: 1250,
  activeShipments: 2,
  completedShipments: 18,
  address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos State',
  pin: '1234',
};

export const sampleDriver: DriverInfo = {
  name: 'Babajide Sanusi',
  phone: '0812 345 6789',
  rating: 4.9,
  totalDeliveries: 1240,
  vehicleModel: 'Toyota HiAce • Silver Express',
  vehiclePlate: 'LAG-492-APP',
  currentLocationName: 'Approaching Lekki Toll Gate, Admiralty Way',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const sampleOrders: DeliveryOrder[] = [
  {
    id: 'ord-lag-9428',
    trackingNumber: 'SW-LAG-9428',
    status: 'in_transit',
    createdAt: 'Today, 09:15 AM',
    estimatedDelivery: 'Today, 02:45 PM',
    sender: {
      fullName: 'Swift Regional Mainland Hub',
      phone: '+234 800 794 3854',
      address: 'Hub 04, Computer Village Depot',
      apartment: 'Logistics Bay 2',
      city: 'Ikeja, Lagos',
      postalCode: '100271',
      pickupTimeWindow: 'Morning (09:00 - 11:00 AM)',
      pickupNotes: 'Dispatched via priority mainland-island corridor',
    },
    receiver: {
      fullName: 'Elisha Adamu',
      phone: '+234 803 456 7890',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1',
      apartment: 'Penthouse Suite 4',
      city: 'Lagos',
      postalCode: '105102',
      deliveryInstructions: 'Buzz security at main estate gate; contact upon arrival.',
    },
    packageInfo: {
      category: 'cargo',
      weight: 3.4,
      description: 'MacBook Pro M3 Max & Development Peripherals',
      isFragile: true,
      requiresSignature: true,
    },
    payment: {
      method: 'paystack',
      baseFare: 12500,
      distanceFare: 2500,
      weightFare: 500,
      insurance: 1500,
      discount: 0,
      vat: 1125,
      total: 17625,
      isPaid: false,
      promoCode: '',
      cardNumberMasked: '•••• 8920',
      subtotal: 12500,
      deliveryFee: 2500,
      serviceFee: 500,
    },
    driver: sampleDriver,
    timeline: [
      {
        status: 'confirmed',
        title: 'Waybill Issued & Verified',
        description: 'Payment authorized and dispatch courier assigned.',
        timestamp: '09:15 AM',
        completed: true,
        current: false,
        location: 'Ikeja Depot, Lagos',
      },
      {
        status: 'in_transit',
        title: 'Package Out for Transit',
        description: 'Moving along Lekki-Ikoyi Toll Expressway corridor.',
        timestamp: '01:20 PM',
        completed: true,
        current: true,
        location: 'Approaching Lekki Toll Gate',
      },
      {
        status: 'out_for_delivery',
        title: 'Doorstep Courier Handover',
        description: 'Courier driver is 2 stops away from Admiralty Way.',
        timestamp: 'Est. 02:30 PM',
        completed: false,
        current: false,
        location: 'Lekki Phase 1 Delivery Zone',
      },
      {
        status: 'delivered',
        title: 'Delivered & Stamped',
        description: 'Signed digital receipt and secure PIN confirmation.',
        timestamp: 'Est. 02:45 PM',
        completed: false,
        current: false,
        location: 'Plot 14 Admiralty Way',
      },
    ],
    // Aliases for alternate access
    itemDescription: 'MacBook Pro M3 Max & Development Peripherals',
    weightKg: 3.4,
    originAddress: 'Hub 04, Ikeja Computer Village Depot, Ikeja, Lagos',
    destinationAddress: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos State',
    packageCategory: 'Electronics & High Value Hardware',
  },
  {
    id: 'ord-abj-1530',
    trackingNumber: 'SW-ABJ-1530',
    status: 'delivered',
    createdAt: 'Yesterday, 09:00 AM',
    estimatedDelivery: 'Yesterday, 03:15 PM',
    sender: {
      fullName: 'Legal Chamber Registrar',
      phone: '+234 809 112 3344',
      address: 'Plot 210 Aminu Kano Crescent',
      apartment: '3rd Floor Chamber',
      city: 'Wuse II, Abuja',
      postalCode: '900288',
      pickupTimeWindow: 'Morning (09:00 - 10:30 AM)',
      pickupNotes: 'Sealed document envelope with wax stamp',
    },
    receiver: {
      fullName: 'Barrister Elisha Adamu',
      phone: '+234 803 456 7890',
      address: 'Maitama Judicial Enclave',
      apartment: 'Villa 12',
      city: 'Maitama, Abuja FCT',
      postalCode: '900271',
      deliveryInstructions: 'Deliver directly to recipient with signature requirement.',
    },
    packageInfo: {
      category: 'documents',
      weight: 1.2,
      description: 'Corporate Legal Instruments & Official Brass Seals',
      isFragile: false,
      requiresSignature: true,
    },
    payment: {
      method: 'wallet',
      baseFare: 6500,
      distanceFare: 1500,
      weightFare: 500,
      insurance: 0,
      discount: 0,
      vat: 637.5,
      total: 8637.5,
      isPaid: true,
      paidDate: 'Yesterday, 03:15 PM via NGN Wallet',
      promoCode: '',
      cardNumberMasked: 'Prepaid Wallet',
      subtotal: 6500,
      deliveryFee: 1500,
      serviceFee: 500,
    },
    driver: {
      ...sampleDriver,
      name: 'Haruna Danladi',
      phone: '+234 812 990 1234',
      vehiclePlate: 'ABJ-891-KU',
      currentLocationName: 'Delivered at Maitama Security Gate',
    },
    timeline: [
      {
        status: 'confirmed',
        title: 'Waybill Issued',
        description: 'Document registered at Wuse II Processing Center.',
        timestamp: '09:00 AM',
        completed: true,
        current: false,
      },
      {
        status: 'in_transit',
        title: 'Capital Transit',
        description: 'Dispatched through Shehu Shagari Way route.',
        timestamp: '01:30 PM',
        completed: true,
        current: false,
      },
      {
        status: 'delivered',
        title: 'Signed & Delivered',
        description: 'Package accepted and signed at Maitama residence.',
        timestamp: '03:15 PM',
        completed: true,
        current: true,
      },
    ],
    itemDescription: 'Corporate Legal Instruments & Official Brass Seals',
    weightKg: 1.2,
    originAddress: 'Plot 210 Aminu Kano Crescent, Wuse II, Abuja FCT',
    destinationAddress: 'Maitama Judicial Quarters, Maitama, Abuja FCT',
    packageCategory: 'Confidential Documents',
  },
  {
    id: 'ord-phc-8821',
    trackingNumber: 'SW-PHC-8821',
    status: 'delivered',
    createdAt: 'Sep 14, 2026, 08:00 AM',
    estimatedDelivery: 'Sep 14, 2026, 11:20 AM',
    sender: {
      fullName: 'Delta Marine Instrumentation Ltd',
      phone: '+234 803 777 8899',
      address: 'Trans-Amadi Industrial Layout',
      apartment: 'Bay 7',
      city: 'Port Harcourt',
      postalCode: '500272',
      pickupTimeWindow: 'Morning (08:00 - 09:30 AM)',
      pickupNotes: 'Heavy industrial crate with fragile calibration sensors',
    },
    receiver: {
      fullName: 'Elisha Adamu (Operations)',
      phone: '+234 803 456 7890',
      address: 'Old GRA Residential Enclave',
      apartment: 'Block 3',
      city: 'Port Harcourt, Rivers State',
      postalCode: '500241',
      deliveryInstructions: 'Forklift inspection at receiving entrance.',
    },
    packageInfo: {
      category: 'cargo',
      weight: 12.8,
      description: 'Oilfield Sensor Kit & Precision Valve Calibration Units',
      isFragile: true,
      requiresSignature: true,
    },
    payment: {
      method: 'card',
      baseFare: 28000,
      distanceFare: 4500,
      weightFare: 1000,
      insurance: 2500,
      discount: 0,
      vat: 2512.5,
      total: 36012.5,
      isPaid: true,
      paidDate: 'Sep 14, 2026, 11:20 AM via Mastercard',
      cardNumberMasked: '•••• 5120',
      subtotal: 28000,
      deliveryFee: 4500,
      serviceFee: 1000,
    },
    driver: {
      ...sampleDriver,
      name: 'Chukwudi Eze',
      phone: '+234 802 334 5566',
      vehiclePlate: 'RIV-314-PH',
      currentLocationName: 'Delivered to Receiving Bay',
    },
    timeline: [
      {
        status: 'confirmed',
        title: 'Waybill Created',
        description: 'Cargo booked at Trans-Amadi Central Depot.',
        timestamp: '08:00 AM',
        completed: true,
        current: false,
      },
      {
        status: 'in_transit',
        title: 'Heavy Cargo Transit',
        description: 'Escorted delivery along Aba Road Corridor.',
        timestamp: '09:45 AM',
        completed: true,
        current: false,
      },
      {
        status: 'delivered',
        title: 'Delivered to Receiver',
        description: 'Consignment signed and inspected at Old GRA.',
        timestamp: '11:20 AM',
        completed: true,
        current: true,
      },
    ],
    itemDescription: 'Oilfield Sensor Kit & Precision Valve Calibration Units',
    weightKg: 12.8,
    originAddress: 'Trans-Amadi Industrial Layout, Port Harcourt, Rivers State',
    destinationAddress: 'Old GRA Residential Enclave, Port Harcourt, Rivers State',
    packageCategory: 'Industrial Machinery',
  },
  {
    id: 'ord-kan-3210',
    trackingNumber: 'SW-KAN-3210',
    status: 'pending',
    createdAt: 'Today, 11:30 AM',
    estimatedDelivery: 'Tomorrow, 05:00 PM',
    sender: {
      fullName: 'Kano Artisan Guild',
      phone: '+234 806 223 4455',
      address: 'Kurmi Market Central Way',
      city: 'Kano',
      postalCode: '700211',
      pickupTimeWindow: 'Afternoon (12:00 - 02:00 PM)',
      pickupNotes: 'Textile and leather bundles',
    },
    receiver: {
      fullName: 'Elisha Adamu',
      phone: '+234 803 456 7890',
      address: 'Bodija Residential Estate',
      city: 'Ibadan, Oyo State',
      postalCode: '200213',
      deliveryInstructions: 'Call upon arrival in Ibadan.',
    },
    packageInfo: {
      category: 'medium_box',
      weight: 5.5,
      description: 'Artisanal Handcrafted Leatherwork & Textile Bundles',
      isFragile: false,
      requiresSignature: true,
    },
    payment: {
      method: 'paystack',
      baseFare: 11000,
      distanceFare: 2500,
      weightFare: 500,
      insurance: 1000,
      discount: 0,
      vat: 1050,
      total: 15050,
      isPaid: false,
      cardNumberMasked: '•••• 1029',
      subtotal: 11000,
      deliveryFee: 2500,
      serviceFee: 500,
    },
    driver: sampleDriver,
    timeline: [
      {
        status: 'confirmed',
        title: 'Waybill Issued & Awaiting Trunk Dispatch',
        description: 'Stored at Kano Kurmi Commercial Hub.',
        timestamp: '11:30 AM',
        completed: true,
        current: true,
      },
      {
        status: 'in_transit',
        title: 'North-South Interstate Transit',
        description: 'Scheduled for regional interstate freight trunk.',
        timestamp: 'Pending Dispatch',
        completed: false,
        current: false,
      },
      {
        status: 'delivered',
        title: 'Ibadan Destination Handover',
        description: 'Delivery to Bodija Estate.',
        timestamp: 'Pending Arrival',
        completed: false,
        current: false,
      },
    ],
    itemDescription: 'Artisanal Handcrafted Leatherwork & Textile Bundles',
    weightKg: 5.5,
    originAddress: 'Kano Kurmi Market Hub, Kano City, Kano State',
    destinationAddress: 'Bodija Residential Estate, Ibadan, Oyo State',
    packageCategory: 'Textiles & Fashion Goods',
  },
];

// Alias for compatibility
export const mockPackages = sampleOrders;

export const mockHubs: LogisticsHub[] = [
  {
    id: 'hub-1',
    name: 'Lekki Phase 1 Smart Hub & 24/7 Lockers',
    city: 'Lagos',
    address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos State',
    phone: '+234 800 794 3853',
    openingHours: 'Open 24/7 (Smart Locker Dropoff & Collection)',
    hours: 'Open 24/7',
    features: ['24/7 Locker Access', 'Instant Cashless Payment', 'Cold Storage Unit', 'VIP Priority Lounge'],
    coordinates: { lat: 6.4474, lng: 3.4723 },
    capacityStatus: 'Available',
  },
  {
    id: 'hub-2',
    name: 'Ikeja Mainland Distribution Center',
    city: 'Lagos',
    address: '18 Obafemi Awolowo Way, Ikeja, Lagos State',
    phone: '+234 800 794 3854',
    openingHours: 'Mon - Sat: 7:00 AM - 9:00 PM',
    hours: 'Mon - Sat: 7:00 AM - 9:00 PM',
    features: ['High-Volume Cargo Bay', 'Customs Verification Desk', 'Packaging Supplies', 'Motorcycle Dispatch Fleet'],
    coordinates: { lat: 6.5954, lng: 3.3515 },
    capacityStatus: 'Available',
  },
  {
    id: 'hub-3',
    name: 'Abuja Central Express Depot',
    city: 'Abuja',
    address: 'Plot 210 Aminu Kano Crescent, Wuse II, Abuja FCT',
    phone: '+234 800 794 3855',
    openingHours: 'Mon - Sun: 8:00 AM - 8:00 PM',
    hours: 'Mon - Sun: 8:00 AM - 8:00 PM',
    features: ['Diplomatic & Official Courier', 'Armed Escort Storage', 'Express Air Freight Desk'],
    coordinates: { lat: 9.0765, lng: 7.4722 },
    capacityStatus: 'Available',
  },
  {
    id: 'hub-4',
    name: 'Port Harcourt Cargo Terminal',
    city: 'Port Harcourt',
    address: '88 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State',
    phone: '+234 800 794 3856',
    openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    hours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    features: ['Heavy Industrial Weighing', 'Maritime Cargo Link', 'Transit Warehouse'],
    coordinates: { lat: 4.8156, lng: 7.0498 },
    capacityStatus: 'Available',
  },
];

export const mockFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does Swift Logistics ₦2.5M Cargo Protection work?',
    answer: 'Every registered package processed through Swift Logistics is automatically insured up to ₦2,500,000 against theft, accidental damage, or transit loss. All claims are settled directly to your wallet or bank account within 48 business hours.',
  },
  {
    id: 'faq-2',
    question: 'What are the delivery transit timelines across Nigeria?',
    answer: 'Same-day Intra-city (Lagos, Abuja, PH): 2 to 4 hours. Regional Interstate Express: 24 hours. Nationwide Standard Ground: 48 to 72 hours with end-to-end GPS telemetry tracking.',
  },
  {
    id: 'faq-3',
    question: 'What items are strictly prohibited from transit?',
    answer: 'Prohibited items include hazardous chemicals, unlicensed firearms or ammunition, volatile fireworks, contraband narcotics, unpreserved perishables, and counterfeit currency. All shipments are digitally scanned at our distribution hubs.',
  },
  {
    id: 'faq-4',
    question: 'How do I redeem my SwiftCoins and Promo Codes?',
    answer: 'Enter promo code SWIFT20 during checkout to get an instant 20% discount (up to ₦3,000). You can also toggle SwiftCoins at checkout to convert every 100 coins into ₦500 delivery credit.',
  },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'driver',
    text: 'Hello Mr. Adamu! I have picked up your package from the Ikeja depot. Currently on the expressway towards Lekki.',
    timestamp: '01:25 PM',
  },
  {
    id: 'msg-2',
    sender: 'customer',
    text: 'Great! Please call me when you reach Admiralty Way so I can buzz security at the estate gate.',
    timestamp: '01:28 PM',
  },
  {
    id: 'msg-3',
    sender: 'driver',
    text: 'Understood, sir. Estimated arrival is around 2:45 PM. Traffic is moving smoothly.',
    timestamp: '01:30 PM',
  },
];

export function getSavedPackages(): DeliveryOrder[] {
  if (typeof window === 'undefined') return sampleOrders;
  try {
    const saved = localStorage.getItem('@swift_orders_data');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading orders from localStorage', e);
  }
  return sampleOrders;
}

export function saveOrdersData(orders: DeliveryOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('@swift_orders_data', JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage', e);
  }
}

export function markPackageAsPaid(orderId: string, paymentMethod: string = 'Paystack'): DeliveryOrder[] {
  const currentOrders = getSavedPackages();
  const updated = currentOrders.map((order) => {
    if (order.id === orderId || order.trackingNumber === orderId) {
      return {
        ...order,
        payment: {
          ...order.payment,
          isPaid: true,
          paidDate: 'Just now via ' + paymentMethod,
        },
      };
    }
    return order;
  });
  saveOrdersData(updated);
  return updated;
}


export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'agent',
    text: 'Hello Mr. Adamu! Welcome to Swift Logistics Concierge Support. How can we assist your consignment today?',
    timestamp: 'Just now',
  },
];

export const cannedFaqs = [
  'Where is my current delivery?',
  'Can I change my delivery address?',
  'Call or message my assigned driver',
  'How does the ₦2.5M insurance claim work?',
];
