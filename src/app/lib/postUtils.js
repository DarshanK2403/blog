// lib/postUtils.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function getPostDirect(slug) {
  await dbConnect();

  const post = await Post.findOne({ slug });
  return post || null;
}
