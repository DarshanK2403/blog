"use client";
import InputComponent from "@/app/components/InputComponent";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import usePostTypes from "@/hook/usePostTypes";

export default function ExtraFields() {
  const [formData, setFormData] = useState({});
  const { postTypes } = usePostTypes();
  const postTypeOpt = postTypes.map((opt) => {
    label: opt.displayName;
    value: opt._id;
  });
  const inputType = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Textarea", value: "textarea" },
    { label: "Select", value: "select" },
    { label: "Multi Select", value: "multi-select" },
    { label: "Radio", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Multi Checkbox", value: "multi-checkbox" },
  ];

  const formFields = [
    {
      name: "postType",
      label: "Post Type",
      type: "multi-select",
      required: true,
      options: [],
    },
    {
      name: "name",
      label: "Internal Key",
      type: "text",
      required: true,
    },
    {
      name: "label",
      label: "Label",
      type: "text",
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "text",
    },
    {
      name: "fieldType",
      label: "Field Type",
      type: "select",
      required: true,
      options: inputType,
    },
    {
      name: "required",
      label: "Required",
      type: "checkbox",
    },
    {
      name: "visible",
      label: "Visible",
      type: "checkbox",
    },
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const res = await fetch("/api/extra-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    setFormData({});
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-4">
        <div>
          <h1 className="text-xl font-bold mb-4">Create Extra Fileds</h1>

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

        {/* <div>
          <table className="text-sm">
            <thead className="font-medium bg-gray-700 border border-gray-700 text-white">
              <tr className="border border-gray-700">
                <td className="border !border-gray-700">Key</td>
                <td className="border !border-gray-700">Display</td>
                <td className="border !border-gray-700 !text-center">Status</td>
                <td className="border !border-gray-700 !text-center">Order</td>
                <td className="border !border-gray-700 !text-center">Action</td>
              </tr>
            </thead>
            <tbody>
              {postTypes?.map((data) => (
                <tr key={data._id}>
                  <td>{data.typeKey}</td>
                  <td>{data.displayName}</td>
                  <td className="!text-center">
                    {data?.isActive === true ? (
                      <span className="text-green-700 bg-green-200 px-2 py-1 border border-green-600/70 text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-200 px-2 py-1 border border-red-600/70 text-xs">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="!text-center">{data.order}</td>
                  <td>
                    <div className="flex gap-2 justify-center items-center">
                      <Edit size={16} className="text-blue-600" />
                      <Trash2 size={16} className="text-red-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </>
  );
}
