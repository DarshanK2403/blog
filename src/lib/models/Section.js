import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
    },
    sectionSlug: {
      type: String,
      required: true,
      unique: true,
    },
    postTypes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostType",
    },
    limit: {
      type: Number,
      default: 10,
    },
    label: {
      type: String,
    },
    order: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fields: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraField",
      },
    ],
  },
  { timestamps: true }
);

const Section =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);
export default Section;
