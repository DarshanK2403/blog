import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { slug } = context.params; // ✅ Correct way to access slug

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const cloudinaryURL = `https://res.cloudinary.com/dohprjabq/image/upload/v1751018760/editorjs/${encodeURIComponent(
    slug
  )}`;

  try {
    const response = await fetch(cloudinaryURL);

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return new NextResponse("Image fetch failed", { status: 500 });
  }
}
