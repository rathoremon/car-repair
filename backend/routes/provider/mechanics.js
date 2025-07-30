const express = require("express");
const router = express.Router();
const mechanicController = require("../../controllers/providerMechanicController");
const { uploadSingle } = require("../../middleware/multerDocument");
const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

// All endpoints require authentication, provider role
router.use(auth, authorize("provider"));

router.get("/self", mechanicController.getSelfMechanic);
router.put("/self", uploadSingle, mechanicController.updateSelfMechanic);
router.get("/", mechanicController.listMechanics);
router.get("/:id", mechanicController.getMechanic);
router.post("/", uploadSingle, mechanicController.addMechanic);
router.put("/:id", uploadSingle, mechanicController.updateMechanic);
router.delete("/:id", mechanicController.deleteMechanic);
router.post("/:id/reset-password", mechanicController.resetPassword);
router.post(
  "/register-self",
  uploadSingle,
  mechanicController.registerSelfMechanic
);

module.exports = router;
