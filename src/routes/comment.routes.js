const router = require("express").Router();
const {
  createComment,
  getComments,
  toggleLikeComment,
  deleteComment,
} = require("../controllers/comment.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, createComment);
router.get("/:postId", auth, getComments);
router.put("/:id/like", auth, toggleLikeComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
