const User = require('../models/User');

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
};