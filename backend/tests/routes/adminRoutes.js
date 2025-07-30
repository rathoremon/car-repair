const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", authenticate, authorize(["admin"]), controller.getAllAdmins);
router.post(
  "/",
  authenticate,
  authorize(["superadmin"]),
  controller.createAdmin
);

module.exports = router;
