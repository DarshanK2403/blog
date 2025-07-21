"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  FileText,
  Calendar,
  Calendar1,
  Home,
  Shield,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Check admin role via API
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/user/role");
        const data = await res.json();
        if (data.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Role fetch failed", err);
      }
    };

    fetchRole();
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white text-gray-800 font-medium border-b-2 border-blue-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-3xl font-bold text-blue-700">Yuva Gujarat</h1>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center hover:text-blue-600">
              <Home className="h-4 w-4 mr-1" /> Home
            </Link>
            <Link
              href="/results"
              className="flex items-center hover:text-blue-600"
            >
              <FileText className="h-4 w-4 mr-1" /> Results
            </Link>
            <Link href="#" className="flex items-center hover:text-blue-600">
              <Calendar className="h-4 w-4 mr-1" /> Admit Card
            </Link>
            <Link href="#" className="flex items-center hover:text-blue-600">
              <Calendar1 className="h-4 w-4 mr-1" /> Exam Calendar
            </Link>

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center hover:text-blue-600"
              >
                <Shield className="h-4 w-4 mr-1" /> Admin Dashboard
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-2 border-t border-gray-200">
          <Link href="/" className="block py-2 px-2 hover:text-blue-600">
            Home
          </Link>
          <Link href="/results" className="block py-2 px-2 hover:text-blue-600">
            Results
          </Link>
          <Link href="#" className="block py-2 px-2 hover:text-blue-600">
            Admit Card
          </Link>
          <Link href="#" className="block py-2 px-2 hover:text-blue-600">
            Exam Calendar
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="block py-2 px-2 hover:text-blue-600">
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
