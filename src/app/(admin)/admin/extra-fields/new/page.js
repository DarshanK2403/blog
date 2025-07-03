"use client";

import InputComponent from "@/app/components/InputComponent";
import { useState } from "react";
import usePostTypes from "@/hook/usePostTypes";

export default function ExtraFields() {
  const [formData, setFormData] = useState({});
  const { postTypes, loading } = usePostTypes();

  const postTypeOpt = postTypes?.map((opt) => ({
    label: opt?.displayName,
    value: opt?._id,
  }));

  const inputType = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Textarea", value: "textarea" },
  ];

  const formFields = [
    {
      name: "postType",
      label: "Post Type",
      type: "select",
      required: true,
      options: postTypeOpt,
    },
    { name: "name", label: "Internal Key", type: "text", required: true },
    { name: "label", label: "Label", type: "text" },
    { name: "placeholder", label: "Placeholder", type: "text" },
    {
      name: "fieldType",
      label: "Field Type",
      type: "select",
      required: true,
      options: inputType,
    },
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/extra-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Extra Fields
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formFields.map((field) => (
            <InputComponent
              key={field.name}
              field={field}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 transition-colors"
          >
            Save Field
          </button>
        </form>
      </div>
    </div>
  );
}
