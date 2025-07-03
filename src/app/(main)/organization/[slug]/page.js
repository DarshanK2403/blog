"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorJsHtml from "editorjs-html";
import styles from "./page.module.css";
const editorJsHtml = EditorJsHtml();
import { linkifyHtml } from "@/lib/linkifyHtml";

const ContentLoader = () => (
  <div className="flex justify-center items-center h-60">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      <div
        className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full"
        style={{ animation: "spin 3s linear infinite" }}
      ></div>
    </div>
  </div>
);

const OrganizationPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(
          `/api/posts?organization=${slug}&postType=page`
        );
        const data = await res.json();
        const postData = data.data[0];
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

        const joinedHtml = Array.isArray(parsed)
          ? parsed.join("")
          : parsed?.toString?.() || "";

        const htmlContent = linkifyHtml(joinedHtml);

        setHtml(htmlContent);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  // const html = post ? editorJsHtml.parse(post.content) : null;

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="min-h-60 bg-white">
        {!html ? (
          <div className="text-center text-gray-500 py-10">
            Loading content...
          </div>
        ) : (
          <div
            className={styles.post}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationPage;
