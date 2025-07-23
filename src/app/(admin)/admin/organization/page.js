"use client";
import useOrganizations from "@/hook/useOrg";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function OrganizationPage() {
  const { organization, loading, error, refetch } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const deleteOrg = async (id) => {
    try {
      const res = await fetch(`/api/organization?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
  
      refetch();
    } catch (error) {
      console.log("Delete Post Type Error", error);
    }
  };

  return (
    <>
      <div className="mx-auto">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organization</h1>
              <p className="text-gray-600">Manage your organization</p>
            </div>
            <button
              className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer"
              onClick={() => router.push("/admin/categories/new")}
            >
              + New Organization
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border px-3 py-2 focus:ring-2 focus:ring-gray-900"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2"
            >
              <option value="name">Sort by Name</option>
              <option value="posts">Sort by Posts</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          <table className="text-sm w-full border font-sans">
            <thead className="font-medium bg-gray-700 border border-gray-700 text-white">
              <tr>
                <td className="border !border-gray-700 px-2">Name</td>
                <td className="border !border-gray-700 px-2">Slug</td>
                <td className="border !border-gray-700 px-2">Description</td>
                <td className="border !border-gray-700 !text-center px-2">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {organization?.map((data) => (
                <tr
                  key={data._id}
                  className="border-t bg-white font-mono border-gray-300"
                >
                  <td className="px-2 py-1">{data.name}</td>
                  <td className="px-2 py-1 text-gray-700">{data.slug}</td>

                  <td className="text-center">{data.description}</td>
                  <td>
                    <div className="flex gap-2 justify-center items-center">
                      <button>
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button onClick={() => deleteOrg(data._id)}>
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
