// Use dynamic rendering only if post content changes frequently
export const dynamic = "force-dynamic"; // Optional: can be removed for static caching

import PostClientView from "./PostClientView";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getPost(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${slug}`, {
      // Add fetch options to avoid stale data if needed
      next: { revalidate: 3600 }, // cache for 1 hour — adjust based on frequency of post updates
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

// SEO metadata for each post
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post not found · Yuva Gujarat" };
  }

  const title = `${post.title} · Yuva Gujarat`;
  const description = post.excerpt || post.title.slice(0, 150);
  const image = `${BASE_URL}/yuva-gujarat-og.png`;
  const url = `${BASE_URL}/posts/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const post = await getPost(params.slug);

  if (!post) return notFound(); // Handle invalid slugs

  return <PostClientView slug={params.slug} />;
}
