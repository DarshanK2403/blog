import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: "editorjs/", // your folder name
      max_results: 100,
    });

    const images = resources.map((res) => ({
      url: res.secure_url,
      public_id: res.public_id,
      format: res.format,
      created_at: res.created_at,
    }));

    return NextResponse.json({ success: true, images });
  } catch (err) {
    console.error("Cloudinary fetch failed:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const public_id = searchParams.get("public_id");

  if (!public_id) {
    return NextResponse.json(
      { success: false, message: "Missing public_id" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
