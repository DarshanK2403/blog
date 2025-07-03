"use client";
import InputComponent from "@/app/components/InputComponent";
import usePostTypes from "@/hook/usePostTypes";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify"; // 📦 Install if not already: `npm i slugify`

export default function PostType() {
  const { postTypes, loading, error, refetch } = usePostTypes();
  const [formData, setFormData] = useState({});

  // Auto-generate slug when displayName changes
  useEffect(() => {
    if (formData.displayName) {
      const generatedSlug = slugify(formData.displayName, {
        lower: true,
        strict: true,
      });
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.displayName]);

  const formFields = [
    {
      name: "displayName",
      label: "Display Name",
      type: "text",
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
      name: "isActive",
      label: "Is Active",
      type: "checkbox",
    },
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });
      refetch();
      setFormData({});
    } catch (error) {
      console.error("Error creating PostType:", error);
    }
  };

  const deletePostType = async (slug) => {
    try {
      const res = await fetch(`/api/post-type?slug=${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();
      refetch();
    } catch (error) {
      console.log("Delete Post Type Error", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
      {/* Table Section */}
      <div>
        <table className="text-sm w-full border mt-10">
          <thead className="font-medium bg-gray-700 border border-gray-700 text-white">
            <tr>
              <td className="border py-2 text-normal !border-gray-700 px-2">
                Display
              </td>
              <td className="border py-2 text-normal !border-gray-700 px-2">
                Slug
              </td>
              <td className="border py-2 text-normal !border-gray-700 text-center px-2">
                Status
              </td>
              <td className="border py-2 text-normal !border-gray-700 text-center px-2">
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {postTypes?.map((data) => (
              <tr key={data._id} className="border-t border-gray-300">
                <td className="px-2 py-2">{data.displayName}</td>
                <td className="py-1">{data.slug}</td>
                <td className="text-center py-1">
                  {data?.isActive ? (
                    <span className="text-green-700 bg-green-200  border border-green-600/70 text-xs py-1 px-2 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-700 bg-red-200  border border-red-600/70 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex gap-2 justify-center items-center">
                    <button>
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button onClick={() => deletePostType(data.slug)}>
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Section */}
      <div>
        <h1 className="text-xl font-bold mb-4">Create Type</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1">
            {formFields.map((field) => (
              <InputComponent
                key={field.name}
                field={field}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
