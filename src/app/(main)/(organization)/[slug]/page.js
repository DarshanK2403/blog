"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorJsHtml from "editorjs-html";
import { linkifyHtml } from "@/lib/linkifyHtml";
import styles from "./page.module.css";

const editorJsHtml = EditorJsHtml();

const Loader = () => (
  <div className="flex flex-col items-center gap-4 py-14">
    {/* Spinner */}
    <svg
      className="h-8 w-8 animate-spin text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75" />
    </svg>

    {/* Skeleton text lines */}
    <div className="w-full max-w-md space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded ${
            i === 5 ? "w-4/5" : "w-full"
          } bg-gray-200 animate-pulse`}
        />
      ))}
    </div>
  </div>
);

export default function OrganizationPage() {
  const { slug } = useParams();           // ⬅ cleaner destructuring
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const res = await fetch(`/api/posts?organization=${slug}&postType=page`, {
          cache: "no-store",
        });

        // Handle non‑200 quickly
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error("Failed to fetch post");
        }

        const { data, success } = await res.json();
        if (!success || !data?.length) {
          throw new Error("No matching page found");
        }

        const postData = data[0];

        // ——— transform image URLs if needed
        const blocks = postData.content.blocks.map((block) =>
          block.type === "image" && block.data?.file?.slug
            ? {
                ...block,
                data: {
                  ...block.data,
                  file: {
                    ...block.data.file,
                    url: `/img/${block.data.file.slug}`,
                  },
                },
              }
            : block
        );

        // ——— Editor.js → HTML
        const parsed = editorJsHtml.parse({ ...postData.content, blocks });
        const htmlOutput = linkifyHtml(
          Array.isArray(parsed) ? parsed.join("") : parsed.toString()
        );

        setHtml(htmlOutput);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="min-h-60 bg-white">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="p-6 text-center text-sm text-red-600">{error}</p>
        ) : (
          <div
            className={styles.post}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
