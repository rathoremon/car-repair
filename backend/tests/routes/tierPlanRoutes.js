const express = require("express");
const router = express.Router();
const controller = require("../controllers/tierPlanController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getPlans);
router.post("/", authenticate, controller.createPlan);
router.put("/:id", authenticate, controller.updatePlan);

module.exports = router;
