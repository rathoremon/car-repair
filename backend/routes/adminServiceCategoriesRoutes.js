const express = require("express");
const router = express.Router();
const serviceCategoryController = require("../controllers/serviceCategoryController");

// Prefix: /api/admin/service-categories
router.post("/", serviceCategoryController.createCategory);
router.get("/", serviceCategoryController.getAllCategories);
router.put("/:id", serviceCategoryController.updateCategory);
router.delete("/:id", serviceCategoryController.deleteCategory);
router.patch("/:id/restore", serviceCategoryController.restoreCategory);

module.exports = router;
