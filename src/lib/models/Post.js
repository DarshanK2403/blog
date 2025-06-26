import mongoose from "mongoose";
import slugify from "slugify";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    postType: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "PostType",
    },
    content: { type: Object, required: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    extraFields: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

PostSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

delete mongoose.connection.models["Post"];

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
