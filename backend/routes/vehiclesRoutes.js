const express = require("express");
const router = express.Router();
const controller = require("../controllers/vehicleController");
const authenticate = require("../middleware/authenticate");
const { uploadSingle } = require("../middleware/multerDocument");
router.use(authenticate);

router.post("/", controller.addVehicle);
router.get("/", controller.getVehicles);
router.get("/:id", controller.getVehicleById);
router.put("/:id", controller.updateVehicle);
router.delete("/:id", controller.deleteVehicle);
router.post(
  "/:id/photo",
  authenticate,
  uploadSingle,
  controller.uploadVehiclePhoto
);
router.delete("/:id/photo", authenticate, controller.deleteVehiclePhoto);

module.exports = router;
