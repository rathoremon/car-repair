const express = require("express");
const router = express.Router();
const controller = require("../controllers/slaController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.logSLAEvent);
router.get("/", authenticate, controller.getSLAStats);

module.exports = router;
