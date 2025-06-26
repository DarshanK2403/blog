import mongoose from "mongoose";
import slugify from "slugify"; // install this package

const postTypeSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug before saving
postTypeSchema.pre("validate", function (next) {
  if (this.displayName && !this.slug) {
    this.slug = slugify(this.displayName, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.PostType ||
  mongoose.model("PostType", postTypeSchema);
