const Comment = require('../models/Comment');
const Reply = require('../models/Reply');

exports.createComment = async (req, res) => {
  const { text } = req.body;

  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    text,
  });

  res.json(comment);
};

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: -1 });

  res.json(comments);
};

exports.toggleLikeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  const index = comment.likes.indexOf(req.user._id);

  if (index === -1) comment.likes.push(req.user._id);
  else comment.likes.splice(index, 1);

  await comment.save();

  res.json(comment);
};