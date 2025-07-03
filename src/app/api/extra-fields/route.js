import dbConnect from "@/lib/dbConnect";
import ExtraField from "@/lib/models/ExtraField";
import { PostType } from "@/lib/models/PostType";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
  await dbConnect();

  const body = await request.json();
  const { postType, name, label, fieldType, placeholder, options } = body;

  try {
    const extraField = await ExtraField.create({
      postType,
      name,
      label,
      fieldType,
      placeholder,
    });

    return Response.json(extraField);
  } catch (error) {
    console.error("Error creating Extra Field:", error);
    return Response.json(
      { error: "Failed to create Extra Field", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const postTypeId = searchParams.get("postType");

  try {
    // If query includes a valid postType id → use findOne
    if (postTypeId && isValidObjectId(postTypeId)) {
      const field = await ExtraField.findOne({ postType: postTypeId })
        .populate("postType", "_id displayName slug")
        .lean();

      return Response.json(field || {}); // return empty object if not found
    }

    // Else return all ExtraFields
    const allFields = await ExtraField.find()
      .populate("postType", "_id displayName slug")
      .lean();

    return Response.json(allFields);
  } catch (error) {
    console.error("Error fetching Extra Fields:", error);
    return Response.json(
      { error: "Failed to fetch Extra Fields", message: error.message },
      { status: 500 }
    );
  }
}