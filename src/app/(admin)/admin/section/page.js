// app/section/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SectionPage() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const res = await fetch("/api/section");
      const data = await res.json();
      setSections(data);
    };
    fetchSections();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/section/${id}`, { method: "DELETE" });
    setSections(sections.filter((s) => s._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Sections</h2>
        <Link href="/admin/section/new">
          <button className="bg-black text-white px-4 py-2">+ New</button>
        </Link>
      </div>
      <div className="border border-gray-300">
        {sections.map((section) => (
          <div
            key={section._id}
            className="flex justify-between items-center px-4 py-2 border-b border-gray-200"
          >
            <div>
              <p className="font-medium">{section.name}</p>
              <p className="text-sm text-gray-500">/{section.slug}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/section/${section._id}/edit`}>
                <button className="bg-blue-600 text-white px-3 py-1">Edit</button>
              </Link>
              <button
                onClick={() => handleDelete(section._id)}
                className="bg-red-600 text-white px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
