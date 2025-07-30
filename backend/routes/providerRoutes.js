const express = require("express");
const router = express.Router();
const controller = require("../controllers/providerController");
const authenticate = require("../middleware/authenticate");

// Onboarding steps (Step 1, 2, 3)
router.post("/onboarding", authenticate, controller.onboarding);

// Get current onboarding status
router.get("/status", authenticate, controller.status);

// Get a specific provider
router.get("/:id", authenticate, controller.getProviderById);

// Update provider data (used in onboarding)
router.put("/:id", authenticate, controller.updateProvider);

// Reset rejected provider onboarding
router.delete(
  "/:providerId/onboarding-reset",
  authenticate,
  controller.resetProviderOnboarding
);

// Get/set onboarding draft
router.get(
  "/:providerId/onboarding-draft",
  authenticate,
  controller.getOnboardingDraft
);
router.patch(
  "/:providerId/onboarding-draft",
  authenticate,
  controller.saveOnboardingDraft
);

// Update KYC status (admin)
router.patch("/:id/kyc", authenticate, controller.updateKycStatus);

// Approve/reject single garage image
router.patch(
  "/:providerId/garage-image/:imageId",
  authenticate,
  controller.updateGarageImageStatus
);
// Bulk approve/reject all images
router.patch(
  "/:providerId/garage-images/approve-all",
  authenticate,
  controller.approveAllGarageImages
);
router.patch(
  "/:providerId/garage-images/reject-all",
  authenticate,
  controller.rejectAllGarageImages
);

// Approve/reject individual document
router.patch(
  "/:providerId/document/:documentId",
  authenticate,
  controller.updateDocumentStatus
);

module.exports = router;
