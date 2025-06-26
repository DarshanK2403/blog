"use client";
import { useState } from "react";
import InputComponent from "@/app/components/InputComponent";

export default function OrganizationForm() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleChange = (name, value) => {
    const updated = { ...formData, [name]: value };

    // Auto-generate slug from name
    if (name === "name") {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      updated.slug = autoSlug;
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
    };

    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Organization created:", data);
      setFormData({ name: "", slug: "", description: "" });
    } catch (err) {
      console.error("Error creating organization:", err);
    }
  };

  const formFields = [
    {
      name: "name",
      label: "Organization Name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Organization</h2>

      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <InputComponent
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
