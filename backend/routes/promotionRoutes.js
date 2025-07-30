// routes/promotionRoutes.js
const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");

// Public endpoint (no middleware needed)
router.get("/active", promotionController.getActivePromotions);

module.exports = router;
