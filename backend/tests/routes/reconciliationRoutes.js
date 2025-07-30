const express = require("express");
const router = express.Router();
const controller = require("../controllers/reconciliationController");
const authenticate = require("../middleware/authenticate");

router.get("/:providerId", authenticate, controller.getProviderInvoices);
router.put("/:id/markup", authenticate, controller.addMarkup);
router.put("/:id/confirm", authenticate, controller.confirmPayment);

module.exports = router;
