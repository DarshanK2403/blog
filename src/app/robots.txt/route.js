export async function GET() {

  const content = `
User-agent: *
Disallow: /admin/
Disallow: /yuva-login/

Sitemap: https://yuvagujarat.in/sitemap.xml
  `.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
