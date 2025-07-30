const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.createPayment);
router.get("/", authenticate, controller.getUserPayments);

module.exports = router;
