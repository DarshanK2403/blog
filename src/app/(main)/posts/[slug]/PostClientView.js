"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorJsHtml from "editorjs-html";
import styles from "./page.module.css";
import Loading from "@/app/loading";

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

        const enforceTargetBlank = (html) => {
          return html.replace(
            /<a\s+href=["'](.*?)["'](?![^>]*target=)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer"'
          );
        };

        const parsed = editorJsHtml.parse({
          ...postData.content,
          blocks,
        });

        const joinedHtml = Array.isArray(parsed)
          ? parsed.join("")
          : parsed?.toString?.() || "";

        const htmlContent = enforceTargetBlank(joinedHtml);

        setHtml(htmlContent); // ✅ Final content with auto-linked URLs
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div className="p-2 max-w-3xl mx-auto mt-5">
      {post && <h1 className={styles.poster}>{post.title}</h1>}

      <div className="min-h-60 bg-white p-4">
        {html ? (
          <div
            className={styles.post}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
