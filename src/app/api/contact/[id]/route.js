import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/requireAdmin";
import Contact from "@/lib/models/Contact";

export async function PATCH(req, context) {
  const user = requireAdmin(req);
  if (user instanceof Response) return user;

  try {
    const { id } = context.params;
    await dbConnect();

    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact us not found." },
        { status: 404 }
      );
    }

    // Only update if not already read
    if (!contact.read) {
      contact.read = true;
      await contact.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        ...contact.toObject(),
        isRead: contact.read, // alias for frontend if needed
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
