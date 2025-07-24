import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
      });
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
