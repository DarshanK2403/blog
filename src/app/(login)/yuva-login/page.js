"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  Building,
  User,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captcha: "",
  });
  const [errors, setErrors] = useState({});
  const [captchaCode] = useState(generateCaptcha());

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.captcha.trim()) newErrors.captcha = "CAPTCHA is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login Attempt:", formData);
    }
  }

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Center Content */}
      <div className="flex justify-center items-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="border border-gray-300 shadow-md bg-white p-8 mt-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-blue-900">Yuva Gujarat</h1>
              <div className="mt-2 text-gray-500 text-xs flex justify-center items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Only for admin</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className={`w-full border-2 border-gray-300 focus:border-blue-700 focus:outline-none px-10 py-2 text-sm rounded-none ${
                      errors.username ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.username && (
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4" /> {errors.username}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full border-2 border-gray-300 focus:border-blue-700 focus:outline-none px-10 py-2 text-sm rounded-none ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4" /> {errors.password}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 font-semibold uppercase tracking-wide rounded-none border border-blue-900"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/google";
                }}
                className="w-full border border-gray-300 bg-white text-gray-700 hover:shadow flex items-center justify-center gap-3 py-2 px-4 font-medium text-sm tracking-wide uppercase transition duration-200 rounded-none"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272v95.1h147.3c-6.4 34.4-25.3 63.6-54 83v68h87.2c51-47 80.3-116.3 80.3-195.8z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c72.6 0 133.6-23.9 178.1-64.9l-87.2-68c-24.2 16.2-55 25.9-90.9 25.9-69.9 0-129-47.2-150.2-110.6H33.8v69.6C77.7 482.2 167.5 544.3 272 544.3z"
                    fill="#34A853"
                  />
                  <path
                    d="M121.8 326.7c-9.2-27.4-9.2-57 0-84.4V172.7H33.8c-38.7 77.4-38.7 169.2 0 246.6l88-68.6z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.7c39.5-.6 77.5 13.9 106.4 40.9l79.4-79.4C413.7 24.7 344.8-1.6 272 0 167.5 0 77.7 62.1 33.8 172.7l88 69.6C143 154.9 202.1 107.7 272 107.7z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="text-center text-gray-500 text-xs mt-6">
            <p>© 2025 Government of India. All rights reserved.</p>
            <p className="mt-1">
              <a href="#" className="hover:text-blue-700 underline">
                Privacy Policy
              </a>
              {" | "}
              <a href="#" className="hover:text-blue-700 underline">
                Terms of Service
              </a>
              {" | "}
              <a href="#" className="hover:text-blue-700 underline">
                Accessibility
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
