"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const quickLinks = [
  { label: "SSC", slug: "ssc" },
  { label: "UPSC", slug: "upsc" },
  { label: "GPSC", slug: "gpsc" },
  { label: "OJAS", slug: "ojas" },
  { label: "IBPS", slug: "ibps" },
  { label: "Railway", slug: "railway" },
  { label: "Defense", slug: "defense" },
  { label: "Police", slug: "police" },
  { label: "Forest", slug: "forest" },
  { label: "Teacher", slug: "teacher" },
  { label: "Clerk", slug: "clerk" },
  { label: "Banking", slug: "banking" },
  { label: "High Court", slug: "high-court" },
  { label: "Judiciary", slug: "judiciary" },
  { label: "Technical", slug: "technical" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (slug) => {
    router.push(`/${slug}`);
    setIsOpen(false);
  };

  return (
    <aside
      ref={ref}
      className="px-4 py-4 sm:py-6 sm:px-6 bg-white sm:bg-transparent border-b sm:border-b-0 sm:border-r border-gray-200 font-sans"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h2>
      <div className="space-y-2">
        {quickLinks.map(({ label, slug }, index) => (
          <div key={slug}>
            <button
              onClick={() => handleNavigate(slug)}
              className="block text-left w-full text-sm px-2 py-1 text-black hover:bg-gray-100"
            >
              {label}
            </button>
            {index !== quickLinks.length - 1 && (
              <hr className="border-gray-300 my-1" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
