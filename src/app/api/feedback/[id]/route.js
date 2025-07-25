import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req, context) {
  const user = requireAdmin(req);
  if (user instanceof Response) return user;

  try {
    const { id } = context.params;
    await dbConnect();

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: "Feedback not found." },
        { status: 404 }
      );
    }

    // Only update if not already read
    if (!feedback.read) {
      feedback.read = true;
      await feedback.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        ...feedback.toObject(),
        isRead: feedback.read, // alias for frontend if needed
      },
    });
  } catch (err) {
    console.error("PATCH Feedback Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update feedback." },
      { status: 500 }
    );
  }
}
