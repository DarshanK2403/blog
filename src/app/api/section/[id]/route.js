import dbConnect from "@/lib/dbConnect";
import Section from "@/models/Section";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await dbConnect();

  try {
    const section = await Section.findById(params.id);
    if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();

  try {
    const updated = await Section.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  await dbConnect();

  try {
    const deleted = await Section.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
