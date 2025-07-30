// routes/mechanicRoutes.js
const express = require("express");
const router = express.Router();
const mechanicController = require("../controllers/mechanicController");
const { uploadSingle } = require("../middleware/multerDocument");
const authorize = require("../middleware/authorize");

// All routes below require provider role
router.use(authorize("provider"));

// router.get("/", mechanicController.listMechanics);
// router.post("/", uploadSingle, mechanicController.addMechanic);
// router.get("/:id", mechanicController.getMechanic);
// router.put("/:id", uploadSingle, mechanicController.updateMechanic);
// router.delete("/:id", mechanicController.deleteMechanic);
// router.post("/:id/reset-password", mechanicController.resetPassword);

// // Extra: get mechanic by userId (for provider==mechanic dual-role UX)
// router.get("/user/:userId", mechanicController.getMechanicByUserId);

module.exports = router;
