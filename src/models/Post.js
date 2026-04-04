const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    image: String,
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 }); // fast sorting

module.exports = mongoose.model('Post', postSchema);