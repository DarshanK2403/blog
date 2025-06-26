"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorJsHtml from "editorjs-html";

const editorJsHtml = EditorJsHtml();

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

const PostDetailPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  const html = post ? editorJsHtml.parse(post.content) : null;

  const toSentenceCase = (str = "") => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {post && (
        <h1 className="text-3xl font-bold mb-4">
          {toSentenceCase(post.title)}
        </h1>
      )}

      <div className="min-h-60 bg-white p-4">
        {!post ? (
          <ContentLoader />
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
