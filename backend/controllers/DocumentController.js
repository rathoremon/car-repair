const documentService = require("../services/documentService");
const { Provider, Document } = require("../models");

// Upload single or multiple documents
exports.upload = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Missing document type" });
    }

    const validTypes = ["license", "gst", "id_proof", "garage_image"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    if (type === "garage_image") {
      // Handle multiple garage images
      const files = req.files || [];

      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: "No garage images uploaded" });
      }

      const provider = await Provider.findByPk(req.user.providerId);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }

      const currentImages = provider.garageImages || [];

      if (currentImages.length + files.length > 6) {
        return res
          .status(400)
          .json({ error: "Maximum 6 garage images allowed" });
      }

      const docs = [];
      for (const file of files) {
        const doc = await documentService.createDocument({
          userId: req.user.id,
          providerId: req.user.providerId,
          file,
          type,
        });
        docs.push(doc);
        currentImages.push(doc.filePath); // Add path to provider's garage images
      }

      provider.garageImages = currentImages;
      await provider.save();

      return res.status(201).json({
        success: true,
        message: "Garage images uploaded successfully",
        data: docs,
        garageImages: provider.garageImages,
      });
    } else {
      // Handle single file document uploads (license, gst, id_proof)
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No document file uploaded" });
      }

      const doc = await documentService.createDocument({
        userId: req.user.id,
        providerId: req.user.providerId,
        file,
        type,
      });

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: doc,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

// List all documents for a user/provider
exports.list = async (req, res, next) => {
  try {
    const docs = await documentService.getDocuments({
      userId: req.user.id,
      providerId: req.user.providerId || req.query.providerId,
    });

    res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: docs,
    });
  } catch (error) {
    console.error("List documents error:", error);
    next(error);
  }
};

// Update document status (for admin use)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatus = ["pending", "under_review", "approved", "rejected"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doc = await documentService.updateStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: `Document status updated to ${status}`,
      data: doc,
    });
  } catch (error) {
    console.error("Update document status error:", error);
    next(error);
  }
};

// controllers/documentController.js
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  console.log("Delete called for Document ID:", id);
  // force log all found ids!
  const allDocs = await Document.findAll();
  console.log(
    "All docs ids in DB:",
    allDocs.map((d) => d.id)
  );
  const doc = await Document.findByPk(id);
  if (!doc) {
    console.log("Not found:", id);
    return res.status(404).json({ error: "Document not found" });
  }
  await doc.destroy();
  res.json({ success: true });
};
