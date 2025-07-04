import PostClientView from "./PostClientView";
import { notFound } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
const FALL = `${BASE}/og-default.jpg`;

async function getPost(slug) {
  const res = await fetch(`${BASE}/api/posts/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

/* ——— dynamic metadata ——— */
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found · Yuva Gujarat" };

  const desc   = post.excerpt || post.title.slice(0, 150);
  const banner = post.banner?.slug ? `${BASE}/img/${post.banner.slug}` : FALL;

  return {
    title:       `${post.title} · Yuva Gujarat`,
    description: desc,
    openGraph: {
      title:       post.title,
      description: desc,
      url:         `${BASE}/posts/${post.slug}`,
      type:        "article",
      images:      [{ url: banner, width: 1200, height: 630 }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: desc,
      images:      [banner],
    },
  };
}

/* ——— route component ——— */
export default function Page({ params }) {
  /*  ✅  Send only the slug to the browser.
      PostClientView will fetch the data itself. */
  return <PostClientView slug={params.slug} />;
}
