import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET() {
  await dbConnect();

  const baseUrl = "https://yuvagujarat.in";

  const today = new Date().toISOString().split("T")[0];

  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const lastWeek = lastWeekDate.toISOString().split("T")[0];

  const staticPages = ["", "latest-jobs", "latest-results"];
  const quickLink = [
    "banking",
    "clerk",
    "defense",
    "forest",
    "gpsc",
    "high-court",
    "ibps",
    "judiciary",
    "ojas",
    "police",
    "railway",
    "ssc",
    "teacher",
    "technical",
    "upsc",
  ];

  const posts = await Post.find()
    .populate({
      path: "postType",
      select: "slug", // or use "name" if needed
    })
    .select("slug updatedAt")
    .then(
      (all) => all.filter((post) => post.postType?.slug === "post") // filter only "post" type
    );

  const urls = [
    // Static Pages
    ...staticPages.map((slug) => {
      const loc = `${baseUrl}/${slug}`;
      return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${today}</lastmod>
          ${slug === "" ? `<priority>1.0</priority>` : ""}
        </url>`;
    }),

    // Quick Links
    ...quickLink.map((slug) => {
      const loc = `${baseUrl}/${slug}`;
      return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${lastWeek}</lastmod>
        </url>`;
    }),

    // Posts (postType: "post")
    ...posts.map((post) => {
      const loc = `${baseUrl}/post/${post.slug}`;
      const lastmod = post.updatedAt?.toISOString().split("T")[0] || today;
      return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${lastmod}</lastmod>
        </url>`;
    }),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("")}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
