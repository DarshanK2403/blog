// lib/helpers/getHomePosts.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import PostType from "@/lib/models/PostType";
import { Organization } from '@/lib/models/Organization';

export async function getHomePosts() {
  await dbConnect();

  const slugs = ["latest-jobs", "latest-results", "job-updates"];
  const postTypes = await PostType.find({ slug: { $in: slugs } });
  const postTypeMap = Object.fromEntries(postTypes.map(pt => [pt.slug, pt._id]));

  const fetchPosts = (postTypeId) =>
    Post.find({ postType: postTypeId, status: "published" })
      .select("title slug extraFields createdAt")
      .populate("organization", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

  const latestJobsPromise = postTypeMap["latest-jobs"]
    ? fetchPosts(postTypeMap["latest-jobs"])
    : Promise.resolve([]);
  const latestResultsPromise = postTypeMap["latest-results"]
    ? fetchPosts(postTypeMap["latest-results"])
    : Promise.resolve([]);

  const [latestJobs, latestResults] = await Promise.all([
    latestJobsPromise,
    latestResultsPromise,
  ]);

  const jobUpdates = [...latestJobs, ...latestResults]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // ✅ Convert to plain serializable data
  return JSON.parse(
    JSON.stringify({
      latestJobs,
      latestResults,
      jobUpdates,
    })
  );
}
