const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getPlans);
router.post("/", authenticate, controller.createPlan);

module.exports = router;
