import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";

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

    return NextResponse.json(
      { success: true, data: saved },
      { status: 201 }
    );
  } catch (err) {
    console.error("Feedback API Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
