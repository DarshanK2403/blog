import dbConnect from "@/lib/dbConnect";
import Category from "@/lib/models/Category";
import Organization from "@/lib/models/Organization";
import { requireAdmin } from "@/lib/requireAdmin";
// GET all categories
export async function GET(request) {
  const user = requireAdmin(request);
  if (user instanceof Response) return user;

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 15;
    const all = searchParams.get("all") === "true";

    if (all) {
      const categories = await Category.find({})
        .populate("organization")
        .sort({ name: 1 });

      return Response.json({
        success: true,
        data: categories,
      });
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({})
        .populate("organization")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      success: true,
      data: categories,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { name, slug, description, organization } = body;

    if (!name || !slug || !organization) {
      return Response.json(
        { success: false, message: "Name, organization and slug required" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      organization,
    });
    return Response.json({ success: true, data: category });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT to update existing category
export async function PUT(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, name, slug, description } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updated });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
