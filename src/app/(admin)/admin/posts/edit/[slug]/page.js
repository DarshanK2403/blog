"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import InputComponent from "@/app/components/InputComponent";
import usePostTypes from "@/hook/usePostTypes";
import useCategories from "@/hook/useCategories";
import useOrganizations from "@/hook/useOrg";
import useExtrafields from "@/hook/useExtraFields";
import { generateSlug } from "@/lib/generateSlug";
import Loading from "@/app/loading";
import useSections from "@/hook/useSection";

const EditorComponent = dynamic(
  () => import("@/app/components/EditorComponent"),
  { ssr: false }
);

export default function EditPostPage() {
  const { slug } = useParams();
  const router = useRouter();

  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [editorContent, setEditorContent] = useState(null);
  const [filteredExtraFields, setFilteredExtraFields] = useState([]);
  const { postTypes } = usePostTypes();
  const { categories } = useCategories({ all: true });
  const { organization } = useOrganizations();
  const { extraFields } = useExtrafields();
  const [getLoading, setDataLoading] = useState(false);
  // Options

  const typeOption = postTypes?.map((type) => ({
    label: type.displayName,
    value: type._id,
  }));

  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const { sections } = useSections();
  const sectionOption = sections?.map((type) => ({
    label: type.name,
    value: type._id,
  }));
  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      setDataLoading(true);
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();
        if ("tags" in data.data) {
          setTags(data.data.tags || []);
        }
        console.log(data);
        if (res.ok) {
          setTitle(data.data.title || "");
          setFormData({
            type: data.data.postType,
            lastDate: data.data?.lastDate ? data.data.lastDate.slice(0, 10) : "",
            resultType: data.data.resultType,
            updateType: data.data.updateType,
            organizationName: data.data.organizationName,
            sectionIds: data.data.sectionIds,
          });
          setStatus(data.data.status || "draft");
          setEditorContent(data?.data.content || null);
        } else {
          console.error("Failed to load post:", data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Set filtered extraFields
  useEffect(() => {
    if (formData.type) {
      const matched = extraFields.filter(
        (field) => field.postType?._id === formData.type
      );
      setFilteredExtraFields(matched);
    }
  }, [formData.type, extraFields]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (!slugManuallyEdited) {
      handleInputChange("slug", generateSlug(value));
    }
  };

  const handleSave = async (finalStatus) => {
    if (!title.trim()) return console.error("Title is required");

    setIsLoading(true);
    try {
      const contentRaw = await editorRef.current?.save();
      console.log(formData);
      const postData = {
        type: formData.type,
        slug,
        title: title.trim(),
        status: finalStatus,
        content: contentRaw,
        tags: tags,
        sectionIds: formData.sectionIds,
        lastDate: formData.lastDate,
        resultType: formData.resultType,
        updateType: formData.updateType,
        organizationName: formData.organizationName,
      };

      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const result = await res.json();
      if (res.ok) {
        router.push("/admin/posts");
      } else {
        console.error("Failed to update:", result.message);
      }
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      name: "type",
      label: "Post Types",
      type: "select",
      required: true,
      options: typeOption,
    },
    {
      name: "lastDate",
      label: "Last Date",
      type: "date",
    },
    {
      name: "resultType",
      label: "Result Type",
      type: "text",
    },
    {
      name: "updateType",
      label: "Update Type",
      type: "text",
      required: true,
    },
    {
      name: "organizationName",
      label: "Organization Name",
      type: "text",
      required: true,
    },
    {
      name: "sectionIds",
      label: "Section",
      type: "multi-select",
      required: true,
      options: sectionOption,
    },
  ];

  if (getLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Edit Post</h1>
        </div>

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Post title"
          className="w-full text-xl font-bold border-b border-slate-300 focus:outline-none py-2"
        />

        {isEditingSlug ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                handleInputChange("slug", e.target.value);
              }}
              className="border px-3 py-1 text-sm w-full"
            />
            <button
              onClick={() => {
                setIsEditingSlug(false);
                setSlugManuallyEdited(true);
              }}
              className="text-sm text-green-600"
            >
              ✅ Done
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center text-sm">
            <code className="text-blue-600">{formData.slug}</code>
            <button
              onClick={() => setIsEditingSlug(true)}
              className="text-xs text-blue-500 underline"
            >
              Edit
            </button>
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="space-y-4">
          {formFields.map((field) => (
            <InputComponent
              key={field.name}
              field={field}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
            />
          ))}
        </div>

        <div className="w-full border border-gray-300 bg-white px-3 py-2 text-sm">
          <label className="block text-gray-800 mb-1 font-medium">Tags:</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-900 text-white px-2 py-1 text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter"
            className="w-full outline-none border-none"
          />
        </div>

        {/* Extra Fields */}
        {filteredExtraFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-600 mt-4">
              Extra Fields
            </h3>
            {filteredExtraFields.map((field) => (
              <InputComponent
                key={field._id}
                field={{
                  name: field.name,
                  label: field.label,
                  type: field.fieldType,
                  options: field.options,
                  required: field.required,
                  placeholder: field.placeholder,
                }}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
              />
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="bg-white border border-slate-200 rounded shadow-sm">
          <EditorComponent ref={editorRef} initialData={editorContent} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleSave("draft")}
            disabled={isLoading}
            className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
