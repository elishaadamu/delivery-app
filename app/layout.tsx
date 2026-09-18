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
  metadataBase: new URL("https://swiftlogistics.ng"),
  title: {
    default: "Swift Logistics Nigeria | VIP Priority Courier & Cargo Tracking",
    template: "%s | Swift Logistics Nigeria",
  },
  description:
    "Nigeria's leading VIP logistics network across Lagos, Abuja, Port Harcourt & Kano. Real-time GPS consignment tracking, ₦2.5M cargo indemnity protection, digital customer card, and official FIRS tax invoices.",
  keywords: [
    "delivery app nigeria",
    "courier service lagos",
    "on-demand delivery nigeria",
    "dispatch rider lagos",
    "express package delivery",
    "real-time order tracking",
    "swift logistics nigeria",
    "parcel delivery ikeja lekki",
    "doorstep delivery nigeria",
  ],
  authors: [{ name: "Swift Logistics Nigeria", url: "https://swiftlogistics.ng" }],
  creator: "Swift Logistics Nigeria Limited",
  publisher: "Swift Logistics Nigeria Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Swift Logistics Nigeria | Priority Express Courier & Consignment Tracking",
    description:
      "Real-time GPS consignment tracking, ₦2.5M transit protection, digital VIP customer cards, and official FIRS tax receipts across Lagos, Abuja, and nationwide.",
    url: "https://swiftlogistics.ng",
    siteName: "Swift Logistics Nigeria",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
