export const dynamic = "force-dynamic";

import PostClientView from "./PostClientView";
import { notFound } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;

async function getPost(slug) {
  try {
    const res = await fetch(`${BASE}/api/posts/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post not found · Yuva Gujarat" };
  }

  const description = post.excerpt || post.title.slice(0, 150);
  const image = `${BASE}/yuva-gujarat-og.png`;

  return {
    title: `${post.title} · Yuva Gujarat`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${BASE}/posts/${post.slug}`,
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
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default function Page({ params }) {
  return <PostClientView slug={params.slug} />;
}
