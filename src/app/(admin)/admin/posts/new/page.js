"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/app/components/InputComponent";
import usePostTypes from "@/hook/usePostTypes";
import useCategories from "@/hook/useCategories";
import useOrganizations from "@/hook/useOrg";
import dynamic from "next/dynamic";
const EditorComponent = dynamic(
  () => import("@/app/components/EditorComponent"),
  {
    ssr: false, // Disable server-side rendering (important for Editor.js)
  }
);
// Dummy category & org list - you will fetch from DB
const categoryOptions = [
  { slug: "general-knowledge", name: "General Knowledge" },
  { slug: "current-affairs", name: "Current Affairs" },
  { slug: "banking", name: "Banking" },
];

const organizationOptions = [
  { slug: "ssc", name: "SSC" },
  { slug: "railway", name: "Railway" },
  { slug: "bank-exams", name: "Bank Exams" },
];

export default function CreatePost() {
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(false);
  const [extraFields, setExtraFields] = useState({});
  const [formData, setFormData] = useState({});
  const { categories } = useCategories({ all: true });
  const categoryOption = categories?.map((data) => ({
    label: data.name,
    value: data._id,
  }));
  const { organization } = useOrganizations();
  const orgOption = organization?.map((data) => ({
    label: data.name,
    value: data._id,
  }));

  const router = useRouter();

  const handleSave = async (finalStatus) => {
    if (!title.trim()) {
      console.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      const content = await editorRef.current?.save();

      const postData = {
        type: formData.type,
        extraFields,
        title: title.trim(),
        category: formData.category,
        organization: formData.organization,
        status: finalStatus,
        content,
      };

      console.log(postData);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/posts");
      } else {
        console.error("Failed to save:", data.message);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "published":
        return "bg-emerald-500";
      case "draft":
        return "bg-amber-500";
      case "archived":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  const { postTypes, loading, error } = usePostTypes();
  const typeOption = postTypes?.map((type) => ({
    label: type.displayName,
    value: type._id,
  }));

  const formFields = [
    {
      name: "type",
      label: "Post Types",
      type: "select",
      required: true,
      options: typeOption,
    },
    {
      name: "organization",
      label: "Organization",
      type: "select",
      required: true,
      options: orgOption,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: categoryOption,
    },
  ];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">
              Create New Post
            </h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${getStatusColor(status)}`}></div>
              <span className="text-sm font-medium text-slate-600 capitalize">
                {status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={() => handleSave("published")}
              disabled={isLoading || !title.trim()}
              className="px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Title Input */}
            <div className="mb-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl font-bold text-slate-900 border-0 border-b-2 border-slate-200 bg-transparent py-4 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400"
                placeholder="Enter your post title..."
              />
            </div>

            {/* Editor Container */}
            <div className="bg-white border border-slate-200 shadow-sm py-4">
              <EditorComponent ref={editorRef} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border-l border-slate-200 bg-white">
          <div className="p-6 space-y-6">
            {/* Post Settings Header */}
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Post Settings
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure your post metadata
              </p>
            </div>

            <div className="space-y-2">
              {formFields.map((field) => (
                <InputComponent
                  key={field.name}
                  field={field}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            {/* {type &&
              PostTypeFields[type]?.map((field) => (
                <div key={field.name} className="text-gray-800">
                  <label className="text-gray-800">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={extraFields[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt} className="text-gray-800">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={extraFields[field.name] || ""}
                      className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))} */}

            {/* Publishing Info */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Publishing Info
              </h4>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Word count:</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between">
                  <span>Last saved:</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  {/* <span>{new Date().toLocaleDateString()}</span> */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                onClick={() => console.log("Preview clicked")}
                className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
