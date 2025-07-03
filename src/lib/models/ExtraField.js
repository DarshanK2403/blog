import mongoose from "mongoose";

const extraFieldSchema = new mongoose.Schema(
  {
    postType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostType",
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
      enum: ["text", "number", "textarea", "date"],
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
