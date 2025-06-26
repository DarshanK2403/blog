import dbConnect from "@/lib/dbConnect";
import Organization from "@/lib/models/Organization";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const organization = await Organization.findOne({ slug: params.slug });

    if (!organization) {
      return Response.json({ success: false, message: "Organization not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: organization }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();

    const updatedOrganization = await Organization.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true }
    );

    if (!updatedOrganization) {
      return Response.json({ success: false, message: "Organization not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: updatedOrganization }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deleted = await Organization.findOneAndDelete({ slug: params.slug });

    if (!deleted) {
      return Response.json({ success: false, message: "Organization not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
