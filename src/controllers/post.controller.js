const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "buddy_script" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ PUT YOUR FUNCTION HERE
exports.createPost = async (req, res) => {
  const { text, visibility } = req.body;

  let imageUrl = "";

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    imageUrl = result.secure_url;
  }

  const post = await Post.create({
    author: req.user._id,
    text,
    image: imageUrl,
    visibility,
  });

  res.json(post);
};

exports.getFeed = async (req, res) => {
  const posts = await Post.find({
    $or: [{ visibility: "public" }, { author: req.user._id }],
  })
    .populate("author", "firstName lastName avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);

  const index = post.likes.indexOf(req.user._id);

  if (index === -1) post.likes.push(req.user._id);
  else post.likes.splice(index, 1);

  await post.save();

  res.json(post);
};
