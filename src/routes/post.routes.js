const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  createPost,
  getFeed,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/post.controller");

router.post("/", auth, upload.single("image"), createPost);
router.get("/", auth, getFeed);
router.get("/:id", auth, getPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, toggleLike);

module.exports = router;
