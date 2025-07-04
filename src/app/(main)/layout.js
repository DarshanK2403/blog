import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "../components/Sidebar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Load custom fonts
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
    "Get the latest government job notifications, exam results, and updates from SSC, UPSC, GPSC, Railway, Banking, Police, and more - curated for Gujarat's youth.",
};

// Root layout structure
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      <body className="flex flex-col min-h-screen bg-[#F6F8FA]">
        <header className="sticky top-0 z-50 h-16">
          <Navbar />
        </header>

        <div className="flex flex-1 min-h-0">
          <aside className="hidden md:block w-64 bg-gray-900 text-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </aside>

          <main className="flex-1 overflow-y-auto min-h-0 bg-[#F6F8FA]">
            <div className="max-w-5xl mx-auto px-4">{children}</div>
          </main>
        </div>

        <footer>
          <Footer />
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
