const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
} = require("../controllers/notification.controller");

router.get("/", auth, getNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.put("/read", auth, markAsRead);

module.exports = router;
