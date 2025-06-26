import dbConnect from "@/lib/dbConnect";
import PostType from "@/lib/models/PostType";

export async function POST(request) {
  await dbConnect();

  function toBoolean(value, defaultValue = false) {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return defaultValue;
  }

  try {
    const body = await request.json();
    const { slug, typeKey, displayName, description, isActive } = body;

    // ✅ Check for existing slug
    const existing = await PostType.findOne({ slug });
    if (existing) {
      return Response.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const newType = await PostType.create({
      slug,
      typeKey,
      displayName,
      description,
      isActive: toBoolean(isActive, false),
    });

    return Response.json(newType);
  } catch (error) {
    console.error("Error creating PostType:", error);
    return Response.json(
      { error: "Failed to create PostType", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const getType = await PostType.find().sort({ order: 1 });
    return Response.json(getType);
  } catch (error) {
    console.error("Error Get PostType:", error);
    return Response.json(
      { error: "Failed to Get PostType", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing id in query" }, { status: 400 });
    }

    const deleted = await PostType.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: "PostType not found" }, { status: 404 });
    }

    return Response.json({ success: true, deleted });
  } catch (error) {
    console.error("Error deleting PostType:", error);
    return Response.json(
      { error: "Failed to delete PostType", message: error.message },
      { status: 500 }
    );
  }
}
