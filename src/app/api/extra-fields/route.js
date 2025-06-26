import dbConnect from "@/lib/dbConnect";
import ExtraField from "@/lib/models/ExtraField";
import Section from "@/lib/models/Section";

export async function POST(request) {
  await dbConnect();

  function toBoolean(value, defaultValue = false) {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return defaultValue;
  }

  const body = await request.json();
  const {
    sectionId,
    name,
    label,
    fieldType,
    placeholder,
    options,
    required,
    visible,
  } = body;

  try {
    // First create ExtraField
    const extraField = await ExtraField.create({
      sectionId: sectionId,
      name: name,
      label: label,
      fieldType: fieldType,
      placeholder: placeholder,
      options: options || [],
      required: toBoolean(required),
      visible: toBoolean(visible),
    });

    // After successfully creating ExtraField, update Section model
    const res = await Section.findByIdAndUpdate(sectionId, {
      $push: { fields: extraField._id },
    });

    console.log(res)

    return Response.json(extraField);
  } catch (error) {
    console.error("Error creating Extra Field:", error);
    return Response.json(
      { error: "Failed to create Extra Field", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const getFields = await ExtraField.find();
    return Response.json(getFields);
  } catch (error) {
    console.error("Error creating Extra Field:", error);
    return Response.json(
      { error: "Failed to create Extra Field", message: error.message },
      { status: 500 }
    );
  }
}
