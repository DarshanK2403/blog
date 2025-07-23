// lib/postUtils.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import PostType from "@/models/PostType";

export async function getPostDirect(slug) {
  await dbConnect();

  const postType = await PostType.findOne(); // Adjust if more than one post type needed
  if (!postType) return null;

  const post = await Post.findOne({ postType: postType._id, slug });
  return post || null;
}
