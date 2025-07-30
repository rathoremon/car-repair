const express = require("express");
const router = express.Router();
const controller = require("../controllers/payoutController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getPayouts);
router.post("/", authenticate, controller.schedulePayout);

module.exports = router;
