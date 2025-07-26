import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  await dbConnect();

  //   const user = requireAdmin(request);
  //   if (user instanceof Response) return user;
  try {
    const [published, draft] = await Promise.all([
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
    ]);


    return Response.json({
      published,
      draft,
      total: published + draft, 
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
