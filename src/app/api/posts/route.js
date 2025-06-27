import dbConnect from "@/lib/dbConnect"; // your DB connection
import Post from "@/lib/models/Post"; // your mongoose Post model
import PostType from "@/lib/models/PostType";
import Organization from "@/lib/models/Organization";
import Category from "@/lib/models/Category";
// Generate slug function
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
};

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      type,
      content,
      category,
      organization,
      status,
      extraFields,
    } = body;

    const missingFields = [];

    if (!title?.trim()) missingFields.push("Title");
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

    let slug = generateSlug(title);

    const existing = await Post.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    const newPost = new Post({
      title,
      slug,
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
    const status = searchParams.get("status");
    const postTypeParam = searchParams.get("postType");
    const organizationParam = searchParams.get("organization");

    const query = {};

    if (status) {
      query.status = status;
    }

    // Handle postType by slug or ObjectId
    if (postTypeParam) {
      if (/^[0-9a-fA-F]{24}$/.test(postTypeParam)) {
        query.postType = postTypeParam;
      } else {
        const type = await PostType.findOne({ slug: postTypeParam });
        if (!type) {
          return Response.json(
            { success: false, message: "Invalid postType slug" },
            { status: 404 }
          );
        }
        query.postType = type._id;
      }
    }

    if (organizationParam) {
      const orgRegex = new RegExp(`^${organizationParam}$`, "i"); // case-insensitive
      const org =
        (await Organization.findOne({ slug: orgRegex })) ||
        (await Organization.findOne({ name: orgRegex }));

      if (!org) {
        return Response.json(
          { success: false, message: "Invalid organization slug" },
          { status: 404 }
        );
      }

      query.organization = org._id;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate({ path: "organization", select: "name slug" })
      .populate({ path: "postType", select: "displayName slug" })
      .lean();

    return Response.json({ success: true, data: posts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
