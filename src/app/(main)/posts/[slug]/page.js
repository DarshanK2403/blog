"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorJsHtml from "editorjs-html";

// Custom parser: convert image URLs to use local slug format like /img/slug.png
const customParsers = {
  image: (block) => {
    const slug = block.data?.file?.slug;
    const url = slug ? `/img/${slug}` : block.data?.file?.url;
    const alt = block.data?.caption || "Image";
    return `<img src="${url}" alt="${alt}" class="editorjs-image" />`;
  },
};

const editorJsHtml = EditorJsHtml(customParsers);

const PostDetailPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();
        const postData = data.data;
        setPost(postData);

        const blocks = postData?.content?.blocks?.map((block) => {
          if (block.type === "image" && block.data?.file?.slug) {
            return {
              ...block,
              data: {
                ...block.data,
                file: {
                  ...block.data.file,
                  url: `/img/${block.data.file.slug}`, // Rewrite to local proxy
                },
              },
            };
          }
          return block;
        });

        const parsed = editorJsHtml.parse({
          ...postData.content,
          blocks,
        });

        const htmlContent = Array.isArray(parsed)
          ? parsed.join("")
          : parsed?.toString?.() || "";

        setHtml(htmlContent);
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {post && <h1 className="text-3xl font-bold mb-4">{post.title}</h1>}

      <div className="min-h-60 bg-white p-4">
        {!html ? (
          <div className="text-center text-gray-500 py-10">Loading content...</div>
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
