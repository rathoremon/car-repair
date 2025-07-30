const express = require("express");
const router = express.Router();
const controller = require("../controllers/documentController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  uploadSingle,
  uploadMultiple,
} = require("../middleware/multerDocument");

// Upload Single Document
router.post("/upload-single", authenticate, uploadSingle, controller.upload);

// Upload Multiple Garage Images
router.post(
  "/upload-multiple",
  authenticate,
  uploadMultiple,
  controller.upload
);

// Get Documents
router.get("/", authenticate, controller.list);

// Update Document Status
router.patch(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  controller.updateStatus
);

// routes/documentRoutes.js
router.delete("/:id", controller.deleteDocument);

module.exports = router;
