const express = require("express");
const router = express.Router();
const controller = require("../controllers/bnplController");
const authenticate = require("../middleware/authenticate");

router.post("/request", authenticate, controller.requestBNPL);
router.get("/status", authenticate, controller.getBNPLStatus);

module.exports = router;
