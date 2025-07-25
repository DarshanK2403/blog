import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const newFeedback = new Feedback({ name, email, message });
    const saved = await newFeedback.save();

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err) {
    console.error("Feedback POST Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const user = requireAdmin(request);
  if (user instanceof Response) return user;

  try {
    await dbConnect();

    const feedbacks = await Feedback.find().sort({
      read: 1,
      createdAt: -1, 
    });

    return NextResponse.json(
      { success: true, data: feedbacks },
      { status: 200 }
    );
  } catch (err) {
    console.error("Feedback GET Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}
