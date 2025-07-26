// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "Get latest government job updates in Gujarat and across India. Find exams, results, notifications, and important dates – all in one place.",
  keywords: [
    "Gujarat Government Jobs",
    "Sarkari Naukri",
    "Yuva Gujarat",
    "Latest Govt Jobs",
    "Government Job Updates",
    "OJAS Bharti",
    "OJAS Jobs",
    "OJAS Gujarat",
    "GPSC Recruitment",
    "UPSC Jobs",
    "SSC Recruitment",
    "Railway Jobs",
    "Bank Jobs",
    "Police Bharti",
    "Forest Department Bharti",
    "Teacher Vacancy",
    "High Court Jobs",
    "Clerk Recruitment",
    "12th Pass Govt Jobs",
    "10th Pass Government Jobs",
    "Graduate Govt Jobs",
    "Freshers Govt Jobs",
    "All India Govt Jobs",
    "Online Form 2025",
    "New Job Vacancy 2025",
    "Govt Exams 2025",
    "Free Job Alert Gujarat",
    "Job Notification Today",
    "Government Job Portal",
    "Latest Sarkari Naukri 2025",
    "Govt Job Result",
    "Admit Card Download",
    "Call Letter OJAS",
    "Upcoming Government Exams",
    "Recruitment Notification 2025",
    "Gujarat Rojgar Samachar",
    "Maru Gujarat Jobs",
  ],
  icons: {
    icon: "/yuva-gujarat.svg",
    apple: "/yuva-gujarat.png",
    shortcut: "/yuva-gujarat.png",
  },
  openGraph: {
    title: "Yuva Gujarat - Govt Job Updates",
    description:
      "Explore latest government job notifications, results, and recruitment details for Gujarat and All India.",
    url: "https://yuvagujarat.in/",
    siteName: "Yuva Gujarat",
    images: [
      {
        url: "/yuva-gujarat.png",
        width: 1155,
        height: 1000,
        alt: "Yuva Gujarat",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning={false}>
        {children}
      </body>
    </html>
  );
}
