const Reply = require('../models/Reply');

exports.createReply = async (req, res) => {
  const { text } = req.body;

  const reply = await Reply.create({
    comment: req.params.commentId,
    author: req.user._id,
    text,
  });

  res.json(reply);
};

exports.getReplies = async (req, res) => {
  const replies = await Reply.find({ comment: req.params.commentId })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: 1 });

  res.json(replies);
};

exports.toggleLikeReply = async (req, res) => {
  const reply = await Reply.findById(req.params.id);

  const index = reply.likes.indexOf(req.user._id);

  if (index === -1) reply.likes.push(req.user._id);
  else reply.likes.splice(index, 1);

  await reply.save();

  res.json(reply);
};