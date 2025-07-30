const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceRequestController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.createRequest);
router.get("/", authenticate, controller.getUserRequests);

module.exports = router;
