const express = require("express");
const router = express.Router();
const { register, login, verifyOtp } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/otp", verifyOtp);

module.exports = router;
