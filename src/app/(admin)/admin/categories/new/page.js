"use client";
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import InputComponent from "@/components/InputComponent";
import useOrganizations from "@/hook/useOrg";

export default function CreateCategoriesPage() {
  const { organization, loading } = useOrganizations();
  const orgOpt = organization.map((data) => ({
    label: data.name,
    value: data._id,
  }));
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    organization: "",
  });

  // Auto-generate slug when name changes
  useEffect(() => {
    setNewCategory((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }));
  }, [newCategory.name]);

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleChange = (name, value) => {
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveCategory = async () => {
    console.log(newCategory);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Saved:", data.data);
        setNewCategory({
          name: "",
          slug: "",
          description: "",
          organization: "",
        });
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      disabled: false,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      disabled: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "organization",
      label: "Select Organization",
      type: "select",
      options: orgOpt,
      disabled: loading,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 shadow-sm rounded">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Category
            </h2>
            <p className="text-sm text-gray-600 mt-1">Add a new job category</p>
          </div>

          <div className="p-6">
            {fields.map((field) => (
              <InputComponent
                key={field.name}
                field={field}
                value={newCategory[field.name]}
                onChange={handleChange}
              />
            ))}

            <button
              onClick={saveCategory}
              disabled={!newCategory.name.trim()}
              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
