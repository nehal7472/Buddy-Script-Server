const router = require("express").Router();
const {
  createComment,
  getComments,
} = require("../controllers/comment.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, createComment);
router.get("/:postId", auth, getComments);

module.exports = router;
