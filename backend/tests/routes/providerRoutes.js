const express = require("express");
const router = express.Router();
const controller = require("../controllers/providerController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.registerProvider);
router.get("/:id", authenticate, controller.getProviderById);
router.put("/:id", authenticate, controller.updateProvider);

module.exports = router;
