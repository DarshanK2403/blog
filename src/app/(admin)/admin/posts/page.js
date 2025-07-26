"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, Plus, Edit2, Trash2, Eye, User } from "lucide-react";
import { useRouter } from "next/navigation";
import usePostTypes from "@/hook/usePostTypes";

const AllPost = () => {
  // Sample data - replace with your actual data source
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState(null);
  const { postTypes } = usePostTypes();
  const postOpt = postTypes.map((data) => data.name);
  const getAllPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getAllPosts();
      console.log(data);
      setPosts(data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure?")) return;
    setDeletingSlug(slug);
    try {
      await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });
      await fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeletingSlug(null);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter posts based on search and filters
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || post.postType.slug === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      published: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      review: "bg-blue-100 text-blue-800 border-blue-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const EditPostPage = (slug) => {
    router.push(`/admin/posts/edit/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all your published content
                </p>
              </div>
              <button
                className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors flex items-center gap-2"
                onClick={() => router.push("posts/new")}
              >
                <Plus size={16} />
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            >
              <option value="All">ALL</option>
              {postTypes.map((data) => (
                <option key={data.slug} value={data.slug}>
                  {data.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredPosts?.length} of {posts?.length} posts
          </p>
        </div>

        {/* Posts Table */}
        <div className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-x divide-gray-200">
                {filteredPosts?.map((post) => (
                  <tr
                    key={post.slug}
                    className="hover:bg-gray-50 border border-gray-300"
                  >
                    {deletingSlug === post.slug ? (
                      <td colSpan={3} className="py-10">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                      </td>
                    ) : (
                      <>
                        {/* Title, Slug, Publisher & Date */}
                        <td className="px-4 py-3 align-top !border-none">
                          <div className="space-y-1">
                            <div className="text-base font-semibold text-gray-900 leading-tight">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 font-mono break-all">
                              {post.slug}
                            </div>

                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                              <span className="font-medium">Date:</span>
                              <span>
                                {formatTimestamp(post.createdAt).split(" ")[0]}
                              </span>
                              <span>
                                {formatTimestamp(post.createdAt).split(" ")[1]}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category, Organization & Status */}
                        <td className="px-3 py-3 align-top !border-none space-y-1">
                          <div
                            className="text-sm text-gray-900 uppercase truncate max-w-48"
                            title={post.organizationName}
                          >
                            <span className="font-medium capitalize">
                              Organization:{" "}
                            </span>
                            {post.organizationName}
                          </div>
                          {/* <div className="text-sm text-gray-900 capitalize">
                            <span className="font-medium">Category:</span>{" "}
                            {post.category.name}
                          </div> */}
                          <div className="mt-1">
                            <span className="text-sm font-medium capitalize">
                              Status:{" "}
                            </span>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium border capitalize ${getStatusBadge(
                                post.status
                              )}`}
                            >
                              {post.status}
                            </span>
                          </div>
                        </td>

                        <td className="px-2 py-3 !border-none space-y-1 text-gray-900 align-top">
                          <div className="flex items-center text-sm text-gray-700">
                            <span className="font-medium capitalize">
                              Type:{" "}
                            </span>
                            <span>{post?.postType?.displayName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <span className="font-medium">Publisher: </span>
                            <span>{post.publisher}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-2 py-3 !border-none">
                          <div className="flex flex-col items-end gap-1">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => EditPostPage(post.slug)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                              onClick={() => handleDelete(post.slug)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No posts found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredPosts?.length} of {filteredPosts?.length}{" "}
            results
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-2 border border-gray-300 text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-black text-white">1</button>
            <button className="px-3 py-2 border border-gray-300 text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPost;
