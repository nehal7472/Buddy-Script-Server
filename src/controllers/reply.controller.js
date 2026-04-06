const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");

// @desc    Create reply
// @route   POST /api/replies/:commentId
// @access  Private
exports.createReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = await Reply.create({
      comment: commentId,
      author: req.user._id,
      text,
    });

    // Update comment replies count
    await Comment.findByIdAndUpdate(commentId, { $inc: { repliesCount: 1 } });

    const populatedReply = await Reply.findById(reply._id)
      .populate("author", "firstName lastName avatar");

    // Create notification for comment author
    if (comment.user.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: comment.user,
        sender: req.user._id,
        type: "reply",
        post: comment.post,
        comment: commentId,
      });

      if (global.io) {
        global.io.to(comment.user.toString()).emit("notification", notification);
      }
    }

    res.status(201).json({
      success: true,
      reply: populatedReply,
    });
  } catch (error) {
    console.error("Create reply error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get replies for a comment
// @route   GET /api/replies/:commentId
// @access  Private
exports.getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      replies,
    });
  } catch (error) {
    console.error("Get replies error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Toggle like on reply
// @route   PUT /api/replies/:id/like
// @access  Private
exports.toggleLikeReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const userId = req.user._id;
    const isLiked = reply.likes.includes(userId);

    if (isLiked) {
      reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
    } else {
      reply.likes.push(userId);
    }

    await reply.save();

    res.status(200).json({
      success: true,
      likes: reply.likes,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    console.error("Toggle reply like error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};