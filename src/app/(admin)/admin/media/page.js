"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Media = () => {
  const [usedImages, setUsedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAndExtractImages = async () => {
      try {
        const res = await fetch("/api/posts");
        const { data: posts } = await res.json();
        const imageUrls = extractEditorJSImageUrls(posts);
        setUsedImages(imageUrls);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndExtractImages();
  }, []);

  const extractEditorJSImageUrls = (posts) => {
    const urls = new Set();
    for (const post of posts) {
      const blocks = post.content?.blocks || [];
      for (const block of blocks) {
        if (block.type === "image" && block.data?.file?.url) {
          urls.add(block.data.file.url);
        }
      }
    }
    return Array.from(urls);
  };

  const renderSkeletons = () =>
    Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="w-full h-40 bg-gray-200 animate-pulse rounded-md" />
    ));

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 flex flex-col md:flex-row gap-6">
      {/* Left Side – Images */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Media Library
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading
            ? renderSkeletons()
            : usedImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() =>
                    selectedImage === url
                      ? setSelectedImage(null)
                      : setSelectedImage(url)
                  }
                  className={`relative cursor-pointer overflow-hidden border bg-white shadow-sm rounded-md hover:shadow-md transition ${
                    selectedImage === url ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Used Media ${index}`}
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
        </div>
      </div>

      {/* Right Side – Details Panel */}
      {selectedImage && (
        <div className="w-full md:w-80 flex-shrink-0 border border-gray-200 bg-white rounded-md shadow-md sticky top-6 h-fit">
          {/* Header */}
          <div className="flex justify-between items-center border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">
              Image Details
            </h2>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Preview */}
          <div className="relative w-full h-40 border-b">
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="object-cover rounded-b-none"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>

          {/* Info */}
          <div className="p-4 space-y-4 text-sm text-gray-800">
            <div>
              <p className="text-gray-600 font-medium">File Name</p>
              <p className="break-all">{selectedImage.split("/").pop()}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Folder</p>
              <p className="break-all">
                {selectedImage.split("/").slice(-2, -1)[0]}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 font-medium">Full URL</p>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedImage)}
                  className="text-xs px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Copy
                </button>
              </div>
              <p className="break-all text-blue-600 text-xs mt-1">
                {selectedImage}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Slug</p>
              <p className="break-all">{selectedImage.split("/").pop()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
