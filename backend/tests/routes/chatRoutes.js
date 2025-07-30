const express = require("express");
const router = express.Router();
const controller = require("../controllers/chatController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.sendMessage);
router.get("/:assignmentId", authenticate, controller.getChatMessages);

module.exports = router;
