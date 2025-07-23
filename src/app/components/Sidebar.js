"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const orgs = [
  "SSC",
  "UPSC",
  "GPSC",
  "OJAS",
  "IBPS",
  "Railway",
  "Defense",
  "Police",
  "Forest",
  "Teacher",
  "Clerk",
  "Banking",
  "High Court",
  "Judiciary",
  "Technical",
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (org) => {
    router.push(`/${org.toLowerCase()}`);
    setIsOpen(false);
  };

  return (
    <aside
      ref={ref}
      className="px-4 py-4 sm:py-6 sm:px-6 bg-white sm:bg-transparent border-b sm:border-b-0 sm:border-r border-gray-200 font-sans"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h2>
      <div className="space-y-2">
        {orgs.map((org, index) => (
          <div key={org}>
            <button
              onClick={() => handleNavigate(org)}
              className="block text-left w-full text-sm px-2 py-1 text-black hover:bg-gray-100"
            >
              {org}
            </button>
            {index !== orgs.length - 1 && (
              <hr className="border-gray-300 my-1" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
