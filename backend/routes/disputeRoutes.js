const express = require("express");
const router = express.Router();
const controller = require("../controllers/disputeController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.createDispute);
router.put("/:id/resolve", authenticate, controller.resolveDispute);

module.exports = router;
