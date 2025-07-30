const express = require("express");
const router = express.Router();
const controller = require("../controllers/trackingController");
const authenticate = require("../middleware/authenticate");

router.post("/:assignmentId", authenticate, controller.updateLocation);
router.get("/:assignmentId", authenticate, controller.getLocation);

module.exports = router;
