import fs from "fs";
import path from "path";
import Post from "@/models/Post"; // adjust path as needed

export async function updateHomeDataJSON() {
  const jobFields = "title organization lastDate";
  const resultFields = "title organization resultType";
  const updateFields = "title description";

  const [latestJobs, latestResults, jobUpdates] = await Promise.all([
    Post.find({ postType: "job" }).sort({ createdAt: -1 }).limit(10).select(jobFields),
    Post.find({ postType: "result" }).sort({ createdAt: -1 }).limit(10).select(resultFields),
    Post.find({ postType: "update" }).sort({ createdAt: -1 }).limit(15).select(updateFields),
  ]);

  const homeData = {
    latestJobs,
    latestResults,
    jobUpdates,
  };

  const filePath = path.join(process.cwd(), "public", "data", "homeData.json");
  fs.writeFileSync(filePath, JSON.stringify(homeData, null, 2));
}
