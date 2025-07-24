"use client";
import { useState } from "react";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      return setStatus("All fields are required!");
    }

    setStatus("Submitting...");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus("✅ Thank you for your feedback!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("❌ Failed to send feedback.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-6 bg-white shadow border border-gray-300 space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">📣 Feedback Form</h2>

      <textarea
        name="message"
        required
        placeholder="Write your feedback here..."
        className="w-full border border-gray-400 p-2 text-gray-800 focus:outline-none focus:border-black resize-none"
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <input
        type="text"
        name="name"
        required
        placeholder="Your Name"
        className="w-full border border-gray-400 p-2 text-gray-800 focus:outline-none focus:border-black"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className="w-full border border-gray-400 p-2 text-gray-800 focus:outline-none focus:border-black"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border-none"
      >
        Submit
      </button>

      {status && <p className="text-sm text-gray-700">{status}</p>}
    </form>
  );
}
