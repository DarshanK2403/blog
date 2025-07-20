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
  Home,
} from "lucide-react";
import Image from "next/image";

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
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setIsOpen(false); // Close mobile menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white text-gray-800 font-medium  border-b-2 border-blue-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="!text-3xl font-bold !text-blue-700">Yuva Gujarat</h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>

            <Link
              href="#"
              className="flex items-center hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <FileText className="h-4 w-4 mr-1" />
              Results
            </Link>

            <Link
              href="#"
              className="flex items-center hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Admit Card
            </Link>

            <Link
              href="#"
              className="flex items-center hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Study Material
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-2 border-t border-gray-200 ">
          <Link
            href="/"
            className="block py-2 px-2 font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="#"
            className="block py-2 px-2 font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            Results
          </Link>
          <Link
            href="#"
            className="block py-2 px-2 font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            Admit Card
          </Link>
          <Link
            href="#"
            className="block py-2 px-2 font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            Study Material
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
