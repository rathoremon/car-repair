const express = require("express");
const router = express.Router();
const controller = require("../controllers/invoiceController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.createInvoice);
router.get("/", authenticate, controller.getInvoicesByUser);

module.exports = router;
