import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import PostType from "@/models/PostType";
import PageComponent from "./PageComponent";
import Organization from "@/lib/models/Organization";

async function getPostDirect(slug) {
  await dbConnect();

  const postType = await PostType.findOne();
  if (!postType) return null;

  const post = await Post.findOne({ slug });
  return post || null;
}

async function getPostsByOrganization(slug) {
  await dbConnect();

  // Step 1: Get the organization by slug
  const organization = await Organization.findOne({ slug });
  if (!organization) return null;

  // Step 2: Get all posts with this organization ObjectId
  const posts = await Post.find({ organization: organization._id }).sort({
    createdAt: -1,
  });
  return posts;
}

export async function generateMetadata({ params }) {
  const post = await getPostDirect(params.slug);
  await dbConnect();

  const postType = await PostType.findOne();
  if (!postType) return {};

  if (!post) return {};

  return {
    title: post.title || "Page",
    description: post.description || "",
  };
}

export default async function Page({ params }) {
  const { slug } = params;

  const post = await getPostDirect(params.slug);
  if (!post) return notFound();

  const posts = await getPostsByOrganization(slug);

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="min-h-60 bg-white p-4">
        <PageComponent content={post.content} />
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4 capitalize">{slug} Jobs</h1>

        {posts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          <table className="w-full text-left border">
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="p-2 border">{post.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
