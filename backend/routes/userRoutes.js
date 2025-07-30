const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  markOnboardingComplete,
} = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");

router.patch("/onboarding-complete", authenticate, markOnboardingComplete);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

module.exports = router;
