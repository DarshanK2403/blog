import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import PostType from "@/models/PostType";

export async function GET(request, context) {
  const { slug } = context.params;

  await dbConnect();

  // Step 1: Find PostType ObjectId from name
  const postType = await PostType.findOne({ name: "page" }); // or use slug if your PostType model has it

  if (!postType) {
    return NextResponse.json({ error: "PostType 'page' not found" }, { status: 400 });
  }

  // Step 2: Find post with that PostType and slug
  const post = await Post.findOne({ postType: postType._id, slug });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
