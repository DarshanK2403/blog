import dbConnect from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/requireAdmin";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        {
          status: 400,
        }
      );
    }

    const saved = await Contact.create({ name, email, message });

    return new Response(JSON.stringify({ success: true, data: saved }), {
      status: 201,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  const user = requireAdmin(request);
  if (user instanceof Response) return user;

  try {
    await dbConnect();

    const contacts = await Contact.find().sort({
      read: 1,
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, data: contacts },
      { status: 200 }
    );
  } catch (err) {
    console.error("Feedback GET Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}
