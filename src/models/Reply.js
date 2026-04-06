const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Reply text is required"],
      maxlength: [500, "Reply cannot exceed 500 characters"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
replySchema.index({ comment: 1, createdAt: 1 });

module.exports = mongoose.model("Reply", replySchema);