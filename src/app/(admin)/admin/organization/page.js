"use client";
import useOrganizations from "@/hook/useOrg";
import { Edit, Trash2 } from "lucide-react";

export default function OrganizationPage() {
  const { organization, loading, error, refetch } = useOrganizations();

  const deleteOrg = async (id) => {
    try {
      const res = await fetch(`/api/organization?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      refetch();
    } catch (error) {
      console.log("Delete Post Type Error", error);
    }
  };

  return (
    <>
      <div className="mt-8 max-w-4xl mx-auto">
        <h2>Organization</h2>
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
    </>
  );
}
