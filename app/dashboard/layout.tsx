import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Dashboard & Shipment Tracking | SwiftDrop Express',
  description:
    'Monitor active deliveries, track dispatch couriers in real-time, book door-to-door packages, and manage orders with SwiftDrop Logistics.',
  openGraph: {
    title: 'Customer Dashboard & Live Tracking | SwiftDrop Express',
    description:
      'Real-time GPS delivery tracking, order history, and instant courier dispatch across Nigeria.',
    url: 'https://swiftdrop.ng/dashboard',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SwiftDrop Customer Dashboard and Live Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Dashboard | SwiftDrop Express',
    description: 'Track deliveries and manage couriers in real-time across Nigeria.',
    images: ['/og-image.jpg'],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
