import mongoose from "mongoose";

const extraFieldSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    fieldType: {
      type: String,
      enum: ["text", "number", "textarea", "select", "multi-select", "radio", "checkbox", "multi-checkbox", "date"],
      default: "text",
    },
    options: [
      {
        label: { type: String },
        value: { type: String },
      }
    ],
    required: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

export default mongoose.models.ExtraField || mongoose.model("ExtraField", extraFieldSchema);
