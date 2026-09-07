import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftdrop.ng"),
  title: {
    default: "SwiftDrop Express | On-Demand Courier & Fast Delivery Nigeria",
    template: "%s | SwiftDrop Express",
  },
  description:
    "Fast, reliable, and secure on-demand courier and package delivery service across Lagos, Abuja, Port Harcourt, and Nigeria. Book deliveries, track dispatch couriers live in real-time, and manage shipments with automated digital receipts.",
  keywords: [
    "delivery app nigeria",
    "courier service lagos",
    "on-demand delivery nigeria",
    "dispatch rider lagos",
    "express package delivery",
    "real-time order tracking",
    "swiftdrop logistics",
    "parcel delivery ikeja lekki",
    "doorstep delivery nigeria",
  ],
  authors: [{ name: "SwiftDrop Logistics", url: "https://swiftdrop.ng" }],
  creator: "SwiftDrop Logistics Inc.",
  publisher: "SwiftDrop Logistics Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SwiftDrop Express | Fast & Reliable Courier Delivery Across Nigeria",
    description:
      "Book on-demand deliveries, track couriers live with GPS precision, and experience effortless shipments across Lagos, Abuja, and nationwide.",
    url: "https://swiftdrop.ng",
    siteName: "SwiftDrop Express Logistics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SwiftDrop Express Delivery App - Live Courier Tracking Across Nigeria",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftDrop Express | Nigeria's Leading On-Demand Courier Service",
    description:
      "Reliable same-day package delivery with live GPS courier tracking across Lagos, Abuja, and nationwide.",
    images: ["/og-image.jpg"],
    creator: "@swiftdrop_ng",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [
      { url: "/apple-icon.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
