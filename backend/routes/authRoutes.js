const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/otp", controller.verifyOtp);
// GET /api/auth/me - Get current user
router.get("/me", authenticate, controller.getCurrentUser);
router.post("/set-password", authenticate, controller.setNewPassword);

module.exports = router;
