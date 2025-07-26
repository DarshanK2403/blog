import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "../components/Sidebar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Use className (NOT variable)
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-3770241554874739"
        ></meta>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3770241554874739"
          crossOrigin="anonymous"
        ></script>
        
      </head>
      <body className="antialiased">
        <div className=" bg-[#F6F8FA] flex w-screen flex-col min-h-screen">
          <div className="flex flex-col min-h-screen">
            <header className="sticky w-full top-0 z-50 h-16 bg-white shadow">
              <Navbar />
            </header>

            <main className="flex flex-col md:flex-row flex-1 px-4 max-w-7xl mx-auto w-full gap-6 bg-white">
              <div className="flex-1 order-1 md:order-2 bg-white">
                {children}
              </div>
              <div className="w-full md:w-64 flex-shrink-0 order-2 md:order-1">
                <Sidebar />
              </div>
            </main>

            <Footer />
          </div>
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
