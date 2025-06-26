import mongoose from "mongoose";

const layoutSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    layoutName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fieldLayout: [
      {
        field: [
          {
            key: { type: String, required: true },
            className: { type: String },
          },
        ],
        rowType: {
          type: String,
          enum: ["row", "column", "full"],
          default: "row",
        },
        order: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const Layout = mongoose.models.Layout || mongoose.model("Layout", layoutSchema);

export default Layout;
