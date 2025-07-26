import { getHomePosts } from "../lib/helper/getHomePosts";
import HomeContent from "./HomeClientComponent";

export const revalidate = 0;

export default async function HomePageServer() {
  const { latestJobs, latestResults, jobUpdates } = await getHomePosts();
  return (
    <HomeContent
      latestJobs={latestJobs}
      latestResults={latestResults}
      jobUpdates={jobUpdates}
    />
  );
}
