import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('image');

    if (!file) {
      return NextResponse.json({ success: 0, message: "No file uploaded" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'editorjs' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(stream);
    });

    return NextResponse.json({
      success: 1,
      file: {
        url: result.secure_url,
      },
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ success: 0, message: err.message }, { status: 500 });
  }
}
