const express = require("express");
const router = express.Router();
const controller = require("../controllers/offerController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, controller.getOffers);
router.post("/", authenticate, controller.createOffer);
router.put("/:id", authenticate, controller.updateOffer);

module.exports = router;
