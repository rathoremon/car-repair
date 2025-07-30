const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getNotifications);
router.post("/", authenticate, controller.createNotification);
router.put("/:id/read", authenticate, controller.markAsRead);

module.exports = router;
