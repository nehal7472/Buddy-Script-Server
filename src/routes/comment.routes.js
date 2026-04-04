const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');

const {
  createComment,
  getComments,
  toggleLikeComment,
} = require('../controllers/comment.controller');

router.post('/:postId', auth, createComment);
router.get('/:postId', auth, getComments);
router.post('/:id/like', auth, toggleLikeComment);

module.exports = router;