// app/sitemap.xml/route.js (or route.ts if using TypeScript)

export async function GET() {
  const baseUrl = "https://yuvagujarat.in";

  const today = new Date().toISOString().split("T")[0]; 

  const staticPages = [
    "",
    "latest-jobs",
    "latest-results",
  ];

  const organizationPages = [
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

  const urls = [...staticPages, ...organizationPages]
    .map((slug) => {
      const loc = `${baseUrl}/${slug}`;
      const isMain = slug === "";
      return `
  <url>
    <loc>${loc}</loc>
    ${isMain || slug === "latest-jobs" || slug === "latest-results" ? `<lastmod>${today}</lastmod>` : ""}
    ${isMain ? `<priority>1.0</priority>` : ""}
  </url>`;
    })
    .join("");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
