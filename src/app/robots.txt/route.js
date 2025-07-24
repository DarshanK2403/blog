export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.yuvagujarat.in";

  const content = `
User-agent: *
Disallow: /admin/
Disallow: /yuva-login/

Sitemap: ${baseUrl}/sitemap.xml
  `.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
