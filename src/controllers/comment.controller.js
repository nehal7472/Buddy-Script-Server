const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// @desc    Create comment or reply
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { text, postId, parentId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({
        success: false,
        message: "Text and postId are required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      text,
      post: postId,
      parent: parentId || null,
      user: req.user._id,
    });

    // Update post comments count
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // If it's a reply, update parent comment's replies count
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, { $inc: { repliesCount: 1 } });
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "firstName lastName avatar",
    );

    // Create notification (if not self-comment)
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: parentId ? "reply" : "comment",
        post: postId,
        comment: comment._id,
      });

      // Send real-time notification
      if (global.io) {
        global.io.to(post.author.toString()).emit("notification", notification);
      }
    }

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parent: null,
    })
      .populate("user", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .populate("user", "firstName lastName avatar")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      }),
    );

    res.status(200).json({
      success: true,
      comments: commentsWithReplies,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Toggle like on comment
// @route   PUT /api/comments/:id/like
// @access  Private
exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      likes: comment.likes,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Toggle comment like error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment",
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parent: comment._id });

    // Delete comment
    await comment.deleteOne();

    // Update post comments count
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
