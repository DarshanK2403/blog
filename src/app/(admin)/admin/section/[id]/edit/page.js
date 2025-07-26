// app/section/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditSectionPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchSection = async () => {
      const res = await fetch(`/api/section/${id}`);
      const data = await res.json();
      setName(data.name);
      setSlug(data.slug);
    };
    fetchSection();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/section/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    router.push("/admin/section");
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Edit Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Section Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2">
          Update
        </button>
      </form>
    </div>
  );
}
