import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Section from "@/models/Section";
import PageComponent from "./PageComponent";
import Link from "next/link";

// Fetch a post by slug
async function fetchPostBySlug(slug) {
  return await Post.findOne({ slug }).lean();
}

// Fetch posts where sectionIds includes the section with slug === params.slug
async function fetchPostsBySectionSlug(slug) {
  const section = await Section.findOne({ slug }).lean();
  if (!section) return [];

  return await Post.find({ sectionIds: section._id })
    .sort({ createdAt: -1 })
    .lean();
}

// Set metadata
export async function generateMetadata({ params }) {
  await dbConnect();
  const post = await fetchPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title || "Page",
    description: post.description || "",
  };
}

// Main Page Component
export default async function Page({ params }) {
  const { slug } = params;

  await dbConnect();
  const post = await fetchPostBySlug(slug);
  if (!post) return notFound();

  const relatedPosts = await fetchPostsBySectionSlug(slug);

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="bg-white p-4">
        <PageComponent content={post.content} />
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {relatedPosts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-600/50 overflow-hidden bg-white">
            {relatedPosts.map(({ _id, slug, title, createdAt }) => (
              <div key={_id} className="px-4 py-2 hover:bg-gray-50">
                <Link href={`/posts/${slug}`}>
                  <div
                    className="flex items-center gap-2 text-sm text-gray-800 line-clamp-1 font-medium font-sans"
                    title={title}
                  >
                    <span className="text-gray-400">➤</span>
                    <span>{title}</span>
                  </div>
                </Link>
                <div className="text-xs text-gray-500 ml-5">
                  📅{" "}
                  {new Date(createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
