import AdminSidebar from "@/components/AdminSidebar";
import "../../../app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

// Load fonts using next/font (SSR safe)
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

// Metadata
export const metadata = {
  title: "Admin Panel",
  description: "Only for Admins",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      redirect("/");
    }
  } catch {
    redirect("/");
  }
  return (
     <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {/* 1️⃣  lock the whole flex row to exactly 100 vh */}
        <div className="flex h-screen">
          {/* 2️⃣  sidebar: fixed height = 100 vh, NO overflow */}
          <aside className="bg-gray-900 border-r flex-shrink-0 h-screen">
            <AdminSidebar />
          </aside>

          {/* 3️⃣  main: it’s the ONLY place allowed to scroll */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
