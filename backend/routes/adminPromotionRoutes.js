// routes/promotionRoutes.js

const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const authenticate = require("../middleware/authenticate");
const { requireAdmin } = require("../middleware/authMiddleware");

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post("/", promotionController.createPromotion);
router.get("/", promotionController.getAllPromotions);
router.put("/:id", promotionController.updatePromotion);
router.delete("/:id", promotionController.deletePromotion);

module.exports = router;
