import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Registration | SwiftDrop Express Nigeria',
  description:
    'Create your free SwiftDrop customer account to book deliveries, track shipments live, and dispatch couriers across Lagos, Abuja, and Nigeria.',
  openGraph: {
    title: 'Join SwiftDrop Express - Customer Registration',
    description:
      'Fast on-demand delivery across Nigeria. Register now to dispatch packages with real-time GPS tracking.',
    url: 'https://swiftdrop.ng/register',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SwiftDrop Customer Registration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Registration | SwiftDrop Express',
    description: 'Sign up for fast and secure package delivery across Nigeria.',
    images: ['/og-image.jpg'],
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
