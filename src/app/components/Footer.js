import { Building } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-6 h-6 text-blue-400" />
              <h4 className="text-xl font-semibold">Yuva Gujarat</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay updated with the latest government job notifications, exam
              updates, and recruitment news — all in one place.
            </p>
            <div className="flex space-x-3 mt-4">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800">
                <span className="text-xs font-semibold">in</span>
              </div>
              {/* Add more icons if needed */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Latest Jobs", "Admit Cards", "Results", "Syllabus", "Answer Keys"].map(
                (link, idx) => (
                  <li key={idx}>
                    <Link href="#" className="hover:text-white transition">
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Categories</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              {["UPSC Jobs", "SSC Jobs", "Banking Jobs", "Railway Jobs", "Defence Jobs"].map(
                (cat, idx) => (
                  <li key={idx}>
                    <Link href="#" className="hover:text-white transition">
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Support</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Contact Us", "Privacy Policy", "Terms of Service", "FAQ", "Feedback"].map(
                (item, idx) => (
                  <li key={idx}>
                    <Link href="#" className="hover:text-white transition">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          © 2025 GovJobs Portal. All rights reserved. | Made with ❤️ for job seekers
        </div>
      </div>
    </footer>
  );
};

export default Footer;
