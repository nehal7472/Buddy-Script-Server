const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createPost,
  getFeed,
  toggleLike,
} = require("../controllers/post.controller");

router.post("/", auth, upload.single("image"), createPost);
router.get("/", auth, getFeed);
router.post("/:id/like", auth, toggleLike);

module.exports = router;
