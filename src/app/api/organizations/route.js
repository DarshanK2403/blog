import dbConnect from "@/lib/dbConnect";
import Organization from "@/lib/models/Organization";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await dbConnect();
    const organizations = await Organization.find().sort({ name: 1 });
    return Response.json(organizations);
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const user = requireAdmin(request);
  if (user instanceof Response) return user;

  try {
    await dbConnect();
    const body = await request.json();

    const newOrganization = await Organization.create(body);
    return Response.json(
      { success: true, data: newOrganization },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
