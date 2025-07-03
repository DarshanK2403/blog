import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import Category from "@/lib/models/Category";
import Organization from "@/lib/models/Organization";

export async function GET(request, context) {
  try {
    await dbConnect();
    const { slug } = await context.params;

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

    const slug = params.slug;

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { slug } = params;

  try {
    const body = await request.json();

    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      {
        title: body.title,
        slug: body.slug,
        type: body.type,
        category: body.category,
        organization: body.organization,
        status: body.status,
        content: body.content,
        extraFields: body.extraFields,
      },
      { new: true } // return updated document
    );

    if (!updatedPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("PUT /api/posts/[slug] error:", err);
    return Response.json(
      { success: false, message: "Error updating post" },
      { status: 500 }
    );
  }
}