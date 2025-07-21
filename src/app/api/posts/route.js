import dbConnect from "@/lib/dbConnect"; // your DB connection
import Post from "@/lib/models/Post"; // your mongoose Post model
import PostType from "@/lib/models/PostType";
import Organization from "@/lib/models/Organization";
import Category from "@/lib/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";
import mongoose from "mongoose";

export async function POST(request) {
  const user = requireAdmin(request);
  if (user instanceof Response) return user;

  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      slug,
      type,
      content,
      category,
      organization,
      status,
      extraFields,
    } = body;

    const missingFields = [];

    if (!title?.trim()) missingFields.push("Title");
    if (!slug?.trim()) missingFields.push("Slug");
    if (!type) missingFields.push("Type");
    if (!content) missingFields.push("Content");
    if (!category?.trim()) missingFields.push("Category");
    if (!organization) missingFields.push("Organization");
    if (!status?.trim()) missingFields.push("Status");

    if (missingFields.length > 0) {
      return Response.json(
        {
          success: false,
          message: `Missing fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    let finalSlug = slug.trim();

    const existing = await Post.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(Math.random() * 10000)}`;
    }

    const newPost = new Post({
      title,
      slug: finalSlug,
      postType: type,
      content,
      category,
      organization,
      status,
      extraFields,
    });

    await newPost.save();

    return Response.json({ success: true, data: newPost }, { status: 201 });
  } catch (err) {
    console.error("Error saving post:", err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const allowedKeys = ["status", "postType", "organization"];
    for (const key of searchParams.keys()) {
      if (!allowedKeys.includes(key)) {
        return Response.json(
          { success: false, message: `Unknown query parameter “${key}”` },
          { status: 400 }
        );
      }
    }

    const query = {};

    // Filter: status
    const status = searchParams.get("status");
    const allowedStatus = ["published", "draft", "archived"];
    if (status) {
      if (!allowedStatus.includes(status)) {
        return Response.json(
          {
            success: false,
            message: `Invalid status “${status}”. Allowed: ${allowedStatus.join(", ")}`,
          },
          { status: 400 }
        );
      }
      query.status = status;
    }

    // Filter: postType
    const postTypeParam = searchParams.get("postType");
    if (postTypeParam) {
      if (mongoose.isValidObjectId(postTypeParam)) {
        query.postType = postTypeParam;
      } else {
        const type = await PostType.findOne({ slug: postTypeParam }).lean();
        if (!type) {
          return Response.json(
            { success: false, message: `postType “${postTypeParam}” not found` },
            { status: 404 }
          );
        }
        query.postType = type._id;
      }
    }

    // Filter: organization
    const organizationParam = searchParams.get("organization");
    if (organizationParam) {
      if (mongoose.isValidObjectId(organizationParam)) {
        query.organization = organizationParam;
      } else {
        const regex = new RegExp(`^${organizationParam}$`, "i");
        const org =
          (await Organization.findOne({ slug: regex }).lean()) ||
          (await Organization.findOne({ name: regex }).lean());

        if (!org) {
          return Response.json(
            { success: false, message: `organization “${organizationParam}” not found` },
            { status: 404 }
          );
        }
        query.organization = org._id;
      }
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate({ path: "organization", select: "name slug" })
      .populate({ path: "postType", select: "displayName slug" })
      .lean();

    return Response.json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
