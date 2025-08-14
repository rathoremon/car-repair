// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/serviceRequestController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Create & list (auth only; controller scopes by role)
router.post("/", authenticate, authorize("customer"), ctrl.createRequest);
router.get("/", authenticate, ctrl.getRequests);
router.get("/:id", authenticate, ctrl.getRequestById);

// Provider/Admin actions
router.put(
  "/:id/accept",
  authenticate,
  authorize(["provider", "admin"]),
  ctrl.acceptRequest
);
router.put(
  "/:id/reject",
  authenticate,
  authorize(["provider", "admin"]),
  ctrl.rejectRequest
);
router.put(
  "/:id/assign-mechanic",
  authenticate,
  authorize(["provider", "admin"]),
  ctrl.assignMechanic
);
router.put(
  "/:id/estimate",
  authenticate,
  authorize(["provider", "admin"]),
  ctrl.setEstimate
);

// Customer approval
router.put(
  "/:id/estimate/approve",
  authenticate,
  authorize("customer"),
  ctrl.approveEstimate
);

// Status + Notes + Timeline
router.put(
  "/:id/status",
  authenticate,
  authorize(["mechanic", "provider", "admin"]),
  ctrl.updateStatus
);
router.post(
  "/:id/notes",
  authenticate,
  authorize(["customer", "provider", "mechanic", "admin"]),
  ctrl.addNote
);
router.get(
  "/:id/timeline",
  authenticate,
  authorize(["customer", "provider", "mechanic", "admin"]),
  ctrl.getTimeline
);

module.exports = router;
