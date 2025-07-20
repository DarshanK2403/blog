import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "../components/Sidebar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "./client-layout";

/* ─── Load fonts ─── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Yuva Gujarat",
  description:
    "Get the latest government job notifications, exam results, and updates for Gujarat's youth.",
  icons: { icon: "/yuva-gujarat.svg" },
};

/* ─── Root layout ─── */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      {/* ① flex‑col + min‑h‑screen = sticky footer when content is short */}
      <body className="flex w-screen flex-col min-h-screen bg-[#F6F8FA]">
        <div className="flex flex-col min-h-screen">
          <header className="sticky w-full top-0 z-50 h-16 bg-white shadow">
            <Navbar />
          </header>

          <main className="flex flex-col md:flex-row flex-1 px-4 max-w-7xl mx-auto w-full gap-6 bg-white">
            {/* Main Content First on Mobile, Second on Desktop */}
            <div className="flex-1 order-1 md:order-2 bg-white">
              <ClientLayout>{children}</ClientLayout>
            </div>

            {/* Sidebar Second on Mobile, First on Desktop */}
            <div className="w-full md:w-64 flex-shrink-0 order-2 md:order-1">
              <Sidebar />
            </div>
          </main>

          <Footer />
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
