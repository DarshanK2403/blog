import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import PostType from "@/lib/models/PostType";

export async function GET() {
  try {
    await dbConnect();

    const slugs = ["latest-jobs", "latest-results", "job-updates"];

    // Fetch all needed postType slugs in one go
    const postTypes = await PostType.find({ slug: { $in: slugs } });
    const postTypeMap = Object.fromEntries(postTypes.map(pt => [pt.slug, pt._id]));

    // Helper to fetch posts
    const fetchPosts = (postTypeId) =>
      Post.find({ postType: postTypeId, status: "published" })
        .select("title slug extraFields createdAt")
        .populate("organization", "name")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(); // for faster read-only access

    const latestJobsPromise = postTypeMap["latest-jobs"] ? fetchPosts(postTypeMap["latest-jobs"]) : [];
    const latestResultsPromise = postTypeMap["latest-results"] ? fetchPosts(postTypeMap["latest-results"]) : [];

    // Job updates = latest from both jobs + results (already fetched above)
    const [latestJobs, latestResults] = await Promise.all([
      latestJobsPromise,
      latestResultsPromise,
    ]);

    const jobUpdates = [...latestJobs, ...latestResults]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); // merge & trim to latest 10

    return Response.json({
      success: true,
      data: { latestJobs, latestResults, jobUpdates },
    });
  } catch (err) {
    console.error("API /home error:", err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
