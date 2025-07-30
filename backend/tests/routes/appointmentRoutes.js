const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.bookAppointment);
router.get(
  "/:serviceRequestId",
  authenticate,
  controller.getAppointmentsByRequest
);

module.exports = router;
