const express = require("express");
const router = express.Router();
const controller = require("../controllers/auditLogController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/", authenticate, authorize(["admin"]), controller.logAction);
router.get("/", authenticate, authorize(["admin"]), controller.getLogs);

module.exports = router;
