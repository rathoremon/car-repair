const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// All routes require admin
router.use(authenticate, authorize(["admin"]));

// List all users
router.get("/users", adminController.getAllUsers);

// List all mechanics (with their providers)
router.get("/mechanics", adminController.getAllMechanics);

// List all providers (with pagination/search/sort for table)
router.get("/providers", adminController.getAllProviders);

// Update provider KYC (approve/reject)
router.patch("/providers/:providerId/kyc", adminController.updateProviderKYC);

// Approve/reject single garage image (admin)
router.patch(
  "/providers/:providerId/garage-image/:imageId",
  adminController.updateGarageImageStatus
);

// Bulk approve/reject all garage images
router.patch(
  "/providers/:providerId/garage-images/approve-all",
  (req, res, next) =>
    adminController.bulkUpdateGarageImages(req, res, next, "approved")
);
router.patch(
  "/providers/:providerId/garage-images/reject-all",
  (req, res, next) =>
    adminController.bulkUpdateGarageImages(req, res, next, "rejected")
);

// Approve/reject single KYC document
router.patch(
  "/providers/:providerId/document/:documentId",
  adminController.updateDocumentStatus
);

module.exports = router;
