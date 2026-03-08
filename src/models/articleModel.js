const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileExtension: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
  },
  { _id: false },
);

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    publishedDate: { type: Date, required: true },
    writer: { type: String, required: true },
    image: { type: imageSchema, default: null },
  },
  { timestamps: true },
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
