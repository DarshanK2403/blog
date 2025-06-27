import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import Category from "@/lib/models/Category";
import Organization from "@/lib/models/Organization";

export async function GET(request, context) {
  try {
    await dbConnect();
    const { slug } = context.params;

    const post = await Post.findOne({ slug })
      .populate("category")
      .populate("organization");

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: post }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
