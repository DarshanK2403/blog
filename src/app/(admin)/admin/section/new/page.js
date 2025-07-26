'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSectionPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!name || !slug) {
      setError("Name and Slug are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        throw new Error("Failed to create section.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/section"), 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Section</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Section Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const val = e.target.value;
              setName(val);
              setSlug(val.toLowerCase().replace(/\s+/g, "-"));
            }}
            className="w-full border border-gray-400 px-3 py-2 focus:outline-none focus:border-black"
            placeholder="e.g., Latest Jobs"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-400 px-3 py-2 focus:outline-none focus:border-black"
            placeholder="e.g., latest-jobs"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Section created successfully!</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 hover:bg-neutral-900 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
