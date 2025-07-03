import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import PostType from "@/lib/models/PostType";
import Category from "@/lib/models/Category";
import Organization from "@/lib/models/Organization";

export async function GET() {
  try {
    await dbConnect();

    const slugs = ["latest-jobs", "latest-results", "job-updates"];

    // Fetch all required PostType IDs
    const postTypes = await PostType.find({ slug: { $in: slugs } });
    const postTypeMap = {};
    postTypes.forEach((pt) => {
      postTypeMap[pt.slug] = pt._id;
    });

    const getTypeId = (slug) => postTypeMap[slug] || null;

    const [latestJobs, latestResults, jobUpdates] = await Promise.all([
      getTypeId("latest-jobs")
        ? Post.find({ postType: getTypeId("latest-jobs"), status: "published" })
            .select("title slug extraFields createdAt")
            .populate("organization", "name")
            .sort({ createdAt: -1 })
            .limit(10)
        : [],

      getTypeId("latest-results")
        ? Post.find({ postType: getTypeId("latest-results"), status: "published" })
            .select("title slug extraFields createdAt")
            .populate("organization", "name")
            .sort({ createdAt: -1 })
            .limit(10)
        : [],

      (() => {
        const ids = [getTypeId("latest-jobs"), getTypeId("latest-results")].filter(Boolean);
        return ids.length
          ? Post.find({ postType: { $in: ids }, status: "published" })
              .select("title slug extraFields createdAt")
              .populate("organization", "name")
              .sort({ createdAt: -1 })
              .limit(10)
          : [];
      })(),
    ]);

    return Response.json({
      success: true,
      data: {
        latestJobs,
        latestResults,
        jobUpdates,
      },
    });
  } catch (err) {
    console.error("API /home error:", err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
