const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticate = require("../middleware/authenticate");

router.post("/pay", authenticate, paymentController.pay);
router.get("/summary", authenticate, paymentController.summary);
router.get("/invoice/:id", authenticate, paymentController.invoice);

module.exports = router;
