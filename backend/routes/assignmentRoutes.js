const express = require("express");
const router = express.Router();
const controller = require("../controllers/assignmentController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.createAssignment);
router.get("/", authenticate, controller.getAssignments);
router.put("/:id/status", authenticate, controller.updateAssignmentStatus);

module.exports = router;
