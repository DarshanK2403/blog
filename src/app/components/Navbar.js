"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  FileText,
  Calendar,
  BookOpen,
  Phone,
  Search,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (dropdown) =>
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const jobCategories = [
    "Central Government",
    "State Government",
    "Railway Jobs",
    "Banking Jobs",
    "Teaching Jobs",
    "Police Jobs",
    "Defense Jobs",
    "PSU Jobs",
  ];

  const examCategories = [
    "UPSC Exams",
    "SSC Exams",
    "Banking Exams",
    "Railway Exams",
    "State PSC",
    "Teaching Exams",
    "Defense Exams",
  ];

  return (
    <nav
      ref={navRef}
      className="bg-white shadow-md border-b-2 border-blue-600 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold text-gray-900">Yuva Gujarat</div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-600 font-medium">
              Home
            </Link>

            {/* Dropdown - Jobs */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("jobs")}
                className="hover:text-blue-600 font-medium flex items-center"
              >
                Jobs
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {activeDropdown === "jobs" && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border rounded-md shadow z-50 py-2">
                  {jobCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-blue-50"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown - Exams */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("exams")}
                className="hover:text-blue-600 font-medium flex items-center"
              >
                Exams
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {activeDropdown === "exams" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow z-50 py-2">
                  {examCategories.map((exam, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-blue-50"
                    >
                      {exam}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#" className="flex items-center hover:text-blue-600 font-medium">
              <FileText className="h-4 w-4 mr-1" />
              Results
            </Link>

            <Link href="#" className="flex items-center hover:text-blue-600 font-medium">
              <Calendar className="h-4 w-4 mr-1" />
              Admit Card
            </Link>

            <Link href="#" className="flex items-center hover:text-blue-600 font-medium">
              <BookOpen className="h-4 w-4 mr-1" />
              Study Material
            </Link>

            <Link href="#" className="flex items-center hover:text-blue-600 font-medium">
              <Phone className="h-4 w-4 mr-1" />
              Contact
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 space-y-2 border-t">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link href="/" className="block py-1 font-medium">
            Home
          </Link>
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mt-2 mb-1">Jobs</h4>
            {jobCategories.map((cat, idx) => (
              <Link key={idx} href="#" className="block text-sm text-gray-600 py-0.5">
                {cat}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mt-3 mb-1">Exams</h4>
            {examCategories.map((exam, idx) => (
              <Link key={idx} href="#" className="block text-sm text-gray-600 py-0.5">
                {exam}
              </Link>
            ))}
          </div>
          <Link href="#" className="block py-1 font-medium">
            Results
          </Link>
          <Link href="#" className="block py-1 font-medium">
            Admit Card
          </Link>
          <Link href="#" className="block py-1 font-medium">
            Study Material
          </Link>
          <Link href="#" className="block py-1 font-medium">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
