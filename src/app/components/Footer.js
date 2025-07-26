import { Building } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const supportItems = [
    { label: "Contact Us", slug: "contact" },
    { label: "Privacy Policy", slug: "privacy-policy" },
    { label: "Terms of Conditions", slug: "terms" },
    { label: "Feedback", slug: "feedback" },
  ];

  const quickLinks1 = [
    { title: "UPSC Jobs", slug: "upsc" },
    { title: "GPSC Jobs", slug: "gpsc" },
    { title: "SSC Jobs", slug: "ssc" },
    { title: "Banking Jobs", slug: "banking" },
    { title: "Railway Jobs", slug: "railway" },
  ];

  const quickLinks2 = [
    // { title: "Latest Jobs", slug: "latest-jobs" },
    { title: "Admit Card", slug: "admit-card" },
    { title: "Results", slug: "results" },
    { title: "Syllabus", slug: "syllabus" },
    { title: "Answer Keys", slug: "answer-keys" },
  ];

  return (
    <footer className="bg-white text-gray-700 py-10 border-t-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-6 h-6 text-blue-600" />
              <h4 className="text-xl font-semibold text-black">Yuva Gujarat</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Stay updated with the latest government job notifications, exam
              updates, and recruitment news — all in one place.
            </p>
            <div className="flex space-x-3 mt-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <span className="text-xs font-semibold text-white">in</span>
              </div>
              {/* Add more icons if needed */}
            </div>
          </div>

          {/* Quick Links */}
           <div>
            <h5 className="text-lg font-semibold mb-3 text-black">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              {quickLinks2.map(({ title, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-3 text-black">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              {quickLinks1.map(({ title, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-lg font-semibold mb-3 text-black">Support</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              {supportItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${item.slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
          © 2025 Yuva Gujarat. All rights reserved. | Made with ❤️ for job
          seekers
        </div>
      </div>
    </footer>
  );
}
