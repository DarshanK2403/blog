import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import { requireAdmin } from "@/lib/requireAdmin";
import Organization from "@/lib/models/Organization";

export async function GET(request) {
  await dbConnect();

  //   const user = requireAdmin(request);
  //   if (user instanceof Response) return user;
  try {
    const [published, draft, organization] = await Promise.all([
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Organization.countDocuments(),
    ]);

    const postsPerOrg = await Post.aggregate([
      {
        $group: {
          _id: "$organization", // the ref ObjectId in Post
          count: { $sum: 1 },
        },
      },
      {
        // pull back the org’s name (or whatever fields you need)
        $lookup: {
          from: "organizations",
          localField: "_id",
          foreignField: "_id",
          as: "org",
        },
      },
      { $unwind: "$org" }, // flatten lookup array
      {
        $project: {
          _id: 0,
        //   orgId: "$org._id",
        count: 1,
        organization: "$org.name", // adjust if your field is different
        },
      },
      { $sort: { count: -1 } }, // optional: biggest first
    ]);

    return Response.json({
      published,
      draft,
      total: published + draft, // handy extra
      organization,
      postsPerOrg
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
