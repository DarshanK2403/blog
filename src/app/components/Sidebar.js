"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

  return (
    <>
        <aside className="px-4 py-4 sm:py-6 sm:px-6 font-sans bg-white sm:bg-transparent border-b sm:border-b-0 sm:border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h2>
        <div className="space-y-2">
          {orgs.map((org, index) => (
            <div key={org}>
              <Link
                href={`/${org.toLowerCase()}`}
                className="block text-sm px-2 py-1 text-black hover:bg-gray-100"
              >
                {org}
              </Link>
              {index !== orgs.length - 1 && (
                <hr className="border-gray-300 my-1" />
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
