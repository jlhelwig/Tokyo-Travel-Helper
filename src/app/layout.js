import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tokyo Trip 2026",
  description: "Your local guide for Tokyo, June 2026",
};

import Script from "next/script";
import OfflineBanner from "@/components/OfflineBanner";

export default function RootLayout({ children }) {
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=places`} 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <OfflineBanner />
        <ServiceWorkerRegister />
        <div className="flex-col" style={{ minHeight: '100vh' }}>
          <main style={{ flex: 1 }}>{children}</main>
          
          <nav className="bottom-nav">
            <Link href="/" className="nav-item">
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link href="/itinerary" className="nav-item">
              <span>📅</span>
              <span>Agenda</span>
            </Link>
            <Link href="/map" className="nav-item">
              <span>📍</span>
              <span>Map</span>
            </Link>
            <Link href="/shopping" className="nav-item">
              <span>🛍️</span>
              <span>Shop</span>
            </Link>
            <Link href="/food" className="nav-item">
              <span>🍜</span>
              <span>Eat</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
