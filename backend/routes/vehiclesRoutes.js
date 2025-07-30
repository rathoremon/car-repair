const express = require("express");
const router = express.Router();
const controller = require("../controllers/vehicleController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.addVehicle);
router.get("/", authenticate, controller.getVehicles);
router.put("/:id", authenticate, controller.updateVehicle);
router.delete("/:id", authenticate, controller.deleteVehicle);

module.exports = router;
