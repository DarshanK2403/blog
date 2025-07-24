"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setStatus(data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Your Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          rows="5"
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Write your message here..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 uppercase tracking-wide font-medium hover:bg-blue-700 transition"
      >
        Send Message
      </button>

      {status && <p className="text-sm text-gray-700">{status}</p>}
    </form>
  );
}
