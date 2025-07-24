"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Media = () => {
  const [usedImages, setUsedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/media", {
          credentials: "same-origin",
        });
        const { images } = await res.json();
        setUsedImages(images); // Store full image objects
      } catch (err) {
        console.error("Failed to load media from Cloudinary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const deleteImage = async (public_id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(
        `/api/media?public_id=${encodeURIComponent(public_id)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.success) {
        setUsedImages((prev) =>
          prev.filter((img) => img.public_id !== public_id)
        );
        if (selectedImage?.public_id === public_id) {
          setSelectedImage(null);
        }
      } else {
        alert("Failed to delete image: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error deleting image");
    }
  };

  const renderSkeletons = () =>
    Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="w-full h-40 bg-gray-200 animate-pulse rounded-md"
      />
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
            : usedImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() =>
                    selectedImage?.public_id === img.public_id
                      ? setSelectedImage(null)
                      : setSelectedImage(img)
                  }
                  className={`relative cursor-pointer overflow-hidden border bg-white shadow-sm rounded-md hover:shadow-md transition ${
                    selectedImage?.public_id === img.public_id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <Image
                    src={img.secure_url || img.url}
                    alt={`Used Media ${index}`}
                    height={400}
                    className="w-auto max-w-full h-40 object-cover"
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
              src={selectedImage.secure_url}
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
              <p className="break-all">
                {selectedImage.public_id.split("/").pop()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Folder</p>
              <p className="break-all">
                {selectedImage.public_id.split("/").slice(-2, -1)[0]}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 font-medium">Full URL</p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(selectedImage.secure_url)
                  }
                  className="text-xs px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Copy
                </button>
              </div>
              <p className="break-all text-blue-600 text-xs mt-1">
                {selectedImage.secure_url}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Slug</p>
              <p className="break-all">
                {selectedImage.public_id.split("/").pop()}
              </p>
            </div>
            <div>
              <button
                onClick={() => deleteImage(selectedImage.public_id)}
                className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
