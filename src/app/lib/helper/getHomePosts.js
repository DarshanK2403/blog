// lib/helpers/getHomePosts.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import Section from "@/lib/models/Section";

export async function getHomePosts() {
  await dbConnect();

  // Step 1: Get all required sections by slug
  const slugs = ["requirement", "results", "updates"];
  const sections = await Section.find({ slug: { $in: slugs } }).lean();

  // Step 2: Map slugs to their _id for quick access
  const sectionMap = Object.fromEntries(sections.map(sec => [sec.slug, sec._id]));

  // Step 3: Define a helper to fetch posts by sectionId
  const fetchPosts = async (sectionSlug) => {
    const sectionId = sectionMap[sectionSlug];
    if (!sectionId) return [];

    return await Post.find({
      sectionIds: sectionId,
      status: "published",
    })
      .select("title slug createdAt organizationName lastDate updateType resultType")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
  };

  // Step 4: Get posts from each section
  const [latestJobs, latestResults, jobUpdates] = await Promise.all([
    fetchPosts("requirement"),
    fetchPosts("results"),
    fetchPosts("updates"),
  ]);

  // Step 5: Return plain JSON
  return JSON.parse(
    JSON.stringify({
      latestJobs,
      latestResults,
      jobUpdates,
    })
  );
}
