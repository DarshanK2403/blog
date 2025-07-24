export const dynamic = "force-dynamic";

import PostClientView from "./PostClientView";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import PostType from "@/models/PostType";
import { getPostDirect } from "@/app/lib/postUtils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// async function getPostDirect(slug) {
//   await dbConnect();

//   // Directly find post by slug (assuming slug is unique)
//   const post = await Post.findOne({ slug });
//   return post || null;
// }

export async function generateMetadata({ params }) {
  const post = await getPostDirect(params.slug);
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

// 📄 Page Component
export default async function Page({ params }) {
  const post = await getPostDirect(params.slug);
  if (!post) return notFound();
  return <PostClientView slug={params.slug} />;
}
