const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getMe,
  getUser,
  updateProfile,
  toggleFollow,
  getSuggestions,
  getOnlineFriends,
} = require("../controllers/user.controller");

// Make sure all these functions exist in user.controller.js
router.get("/me", auth, getMe);
router.get("/suggestions", auth, getSuggestions);
router.get("/online", auth, getOnlineFriends);
router.get("/:id", auth, getUser);
router.put("/profile", auth, updateProfile);
router.put("/:id/follow", auth, toggleFollow);

module.exports = router;
