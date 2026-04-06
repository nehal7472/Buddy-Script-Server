const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Post = require("../models/Post");

// 🚀 Create comment or reply
exports.createComment = async (req, res) => {
  try {
    const { text, postId, parentId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({
        message: "Text and postId required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const comment = await Comment.create({
      text,
      post: postId,
      parent: parentId || null,
      user: req.user._id,
    });

    const post = await Post.findById(postId);

    if (!postId) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post && post.author) {
      if (post.author.toString() !== req.user._id.toString()) {
        const notif = await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: "comment",
          post: postId,
        });

        global.io.to(post.author.toString()).emit("notification", notif);
      }
    }

    const populated = await comment.populate("user", "firstName lastName");

    res.status(201).json(populated);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🚀 Get comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
