const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getAnalytics);
router.post("/", authenticate, controller.logAnalytics);

module.exports = router;
