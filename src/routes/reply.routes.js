const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  createReply,
  getReplies,
  toggleLikeReply,
} = require("../controllers/reply.controller");

router.post("/:commentId", auth, createReply);
router.get("/:commentId", auth, getReplies);
router.put("/:id/like", auth, toggleLikeReply);

module.exports = router;