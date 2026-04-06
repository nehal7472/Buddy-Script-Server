const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Notification = require("../models/Notification");

// 🔹 Upload helper
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "buddy_script" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 🚀 Create Post
exports.createPost = async (req, res) => {
  try {
    const { text, visibility } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({
        message: "Post must have text or image",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    let post = await Post.create({
      author: req.user._id,
      text,
      image: imageUrl,
      visibility,
    });

    // 🔥 populate before sending
    post = await post.populate("author", "firstName lastName avatar");

    res.status(201).json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🚀 Get Feed
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ visibility: "public" }, { author: req.user._id }],
    })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get Feed Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🚀 Toggle Like
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const userId = req.user._id.toString();

    const index = post.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      post.likes.push(req.user._id);

      // 🔔 create notification
      if (post.author.toString() !== userId) {
        const notif = await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: "like",
          post: post._id,
        });

        // ⚡ REALTIME EMIT
        global.io.to(post.author.toString()).emit("notification", notif);
      }
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
