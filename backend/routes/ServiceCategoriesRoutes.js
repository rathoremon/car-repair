const express = require("express");
const router = express.Router();
const serviceCategoryController = require("../controllers/serviceCategoryController");

// Prefix: /api/service-categories
router.get("/", serviceCategoryController.getAllCategories);

module.exports = router;
