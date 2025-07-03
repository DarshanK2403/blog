"use client";

import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExtraFieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch("/api/extra-fields");
        const data = await res.json();
        setFields(data);
      } catch (error) {
        console.error("Failed to load extra fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold max-w-6xl mx-auto text-gray-800 mb-4">
        Extra Fields
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : fields.length === 0 ? (
        <div className="text-center text-gray-500 max-w-6xl mx-auto">No extra fields found.</div>
      ) : (
        <div className="overflow-x-auto max-w-6xl mx-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-2 border-r">Post Type</th>
                <th className="text-left px-4 py-2 border-r text-nowrap">Slug</th>
                <th className="text-left px-4 py-2 border-r">Field Name</th>
                <th className="text-left px-4 py-2 border-r">Field Type</th>
                <th className="text-center px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border-r">
                    {item.postType?.displayName || "—"}
                  </td>
                  <td className="px-4 py-2 border-r font-mono text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 border-r">{item.label}</td>
                  <td className="px-4 py-2 border-r">{item.fieldType}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
