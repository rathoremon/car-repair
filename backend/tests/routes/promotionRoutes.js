const express = require("express");
const router = express.Router();
const controller = require("../controllers/promotionController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getPromotions);
router.post("/", authenticate, controller.createPromotion);

module.exports = router;
