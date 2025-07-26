import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  if (!slug || !type) {
    return Response.json(
      { success: false, message: "Missing slug or type" },
      { status: 400 }
    );
  }

  let exists = false;

  switch (type) {
    case "post":
      exists = !!(await Post.findOne({ slug }));
      break;
    default:
      return Response.json(
        { success: false, message: "Invalid type" },
        { status: 400 }
      );
  }

  return Response.json({ success: true, exists }, { status: 200 });
}
