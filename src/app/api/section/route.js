import dbConnect from "@/lib/dbConnect";
import Section from "@/models/Section";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const section = await Section.create(body);
    return Response.json(section, { status: 201 });
  } catch (error) {
    console.log("POST /api/section error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const sections = await Section.find();
    return Response.json(sections);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
