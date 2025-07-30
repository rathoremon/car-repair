const express = require("express");
const router = express.Router();
const controller = require("../controllers/fleetController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getFleet);
router.post("/", authenticate, controller.addFleetVehicle);

module.exports = router;
