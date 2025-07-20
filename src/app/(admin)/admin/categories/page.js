"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import useCategory from "@/hook/useCategories";

export default function CategoriesPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const { categories, pagination, isLoading } = useCategory({
    page: searchTerm ? 1 : currentPage,
    all: !!searchTerm,
    searchTerm,
  });

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase();

    let filtered = categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term)
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "posts":
          return (b.postCount || 0) - (a.postCount || 0);
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categories, searchTerm, sortBy]);

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure to delete this category?")) return;

    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage your content categories</p>
          </div>
          <button
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer"
            onClick={() => router.push("/admin/categories/new")}
          >
            + Add Category
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

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm border">
              <thead className="text-white">
                <tr>
                  <th className="border !font-medium !border-gray-900 !bg-gray-900 px-2 py-2">
                    Name
                  </th>
                  <th className="border !font-medium !border-gray-900 !bg-gray-900 px-2">
                    Slug
                  </th>
                  <th className="border !font-medium !border-gray-900 !bg-gray-900 px-2">
                    Organization
                  </th>
                  <th className="border !font-medium !border-gray-900 !bg-gray-900 px-2">
                    Description
                  </th>
                  <th className="border !font-medium !border-gray-900 !bg-gray-900 px-2 !text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="bg-white">
                    <td className="border px-2 py-1">{cat.name}</td>
                    <td className="border px-2 py-1 text-gray-700">
                      {cat.slug}
                    </td>
                    <td className="border px-2 py-1 text-gray-700">
                      {cat.organization?.name || "-"}
                    </td>
                    <td className="border px-2 py-1">{cat.description}</td>
                    <td className="border px-2 py-1">
                      <div className="flex gap-2 justify-center">
                        <button>
                          <Edit size={16} className="text-blue-600" />
                        </button>
                        <button onClick={() => deleteCategory(cat._id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination?.totalPages > 1 && !searchTerm && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-800 border-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronsLeft size={20} />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-800 border-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: 3 }).map((_, i) => {
                  let pageNum = currentPage;
                  if (currentPage === 1) pageNum = i + 1;
                  else if (currentPage === pagination.totalPages)
                    pageNum = pagination.totalPages - 2 + i;
                  else pageNum = currentPage - 1 + i;

                  if (pageNum < 1 || pageNum > pagination.totalPages)
                    return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border ${
                        pageNum === currentPage
                          ? "bg-gray-900 text-white"
                          : "border-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className={`px-2 py-1 border ${
                    currentPage === pagination.totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-800 border-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-2 py-1 border ${
                    currentPage === pagination.totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-800 border-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronsRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
