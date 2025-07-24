export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.yuvagujarat.in";

  const content = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/latest-jobs</loc>
  </url>
  <url>
    <loc>${baseUrl}/latest-results</loc>
  </url>

  <!-- Organization Pages -->
  <url><loc>${baseUrl}/ssc</loc></url>
  <url><loc>${baseUrl}/upsc</loc></url>
  <url><loc>${baseUrl}/gpsc</loc></url>
  <url><loc>${baseUrl}/ojas</loc></url>
  <url><loc>${baseUrl}/ibps</loc></url>
  <url><loc>${baseUrl}/railway</loc></url>
  <url><loc>${baseUrl}/defense</loc></url>
  <url><loc>${baseUrl}/police</loc></url>
  <url><loc>${baseUrl}/forest</loc></url>
  <url><loc>${baseUrl}/teacher</loc></url>
  <url><loc>${baseUrl}/clerk</loc></url>
  <url><loc>${baseUrl}/banking</loc></url>
  <url><loc>${baseUrl}/high-court</loc></url>
  <url><loc>${baseUrl}/judiciary</loc></url>
  <url><loc>${baseUrl}/technical</loc></url>

</urlset>
  `.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
