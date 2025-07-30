const { Provider, User, Document } = require("../models");
const { Op } = require("sequelize");

exports.onboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Always find or create provider
    let provider = await Provider.findOne({ where: { userId } });
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const {
      companyName,
      garageImages,
      documents,
      tier,
      serviceArea,
      location,
      availability,
      workingHours,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      serviceCategories,
      upiId,
    } = req.body;

    Object.assign(provider, {
      companyName,
      tier,
      serviceArea,
      location,
      availability,
      workingHours,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
      serviceCategories,
      garageImages,
      kycStatus: "pending",
      rejectionReason: null,
    });

    await provider.save();
    // Mark user onboarding as complete
    await User.update({ onboardingComplete: true }, { where: { id: userId } });

    // Return provider and user for context
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    res.json({
      success: true,
      data: {
        provider: provider.toJSON(),
        user: user.toJSON(),
      },
      providerId: provider.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.status = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    const provider = await Provider.findOne({ where: { userId } });

    if (!provider) return res.status(404).json({ error: "Provider not found" });

    res.json({
      success: true,
      data: {
        provider: provider.toJSON(),
        kycStatus: provider.kycStatus,
        onboardingComplete: user.onboardingComplete,
        status: provider.status,
        providerId: provider.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProviderById = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "name", "email", "phone"] },
        {
          model: Document,
          attributes: ["id", "type", "filePath", "status", "originalName"],
        },
      ],
    });

    if (!provider) return res.status(404).json({ error: "Provider not found" });
    res.status(200).json({
      success: true,
      data: provider.toJSON(),
      providerId: provider.id,
    });
  } catch (err) {
    next("error from providerController.js: " + err);
  }
};

exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const updatableFields = [
      "companyName",
      "tier",
      "serviceArea",
      "location",
      "availability",
      "workingHours",
      "kycStatus",
      "status",
      "serviceCategories",
      "garageImages",
      "address",
      "accountHolderName",
      "accountNumber",
      "ifscCode",
      "bankName",
      "branchName",
      "upiId",
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) provider[field] = req.body[field];
    });
    await provider.save();

    res.status(200).json({
      success: true,
      data: provider.toJSON(),
      providerId: provider.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetProviderOnboarding = async (req, res) => {
  const { providerId } = req.params;
  try {
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res
        .status(404)
        .json({ success: false, error: "Provider not found" });
    }
    // Reset fields
    provider.companyName = null;
    provider.serviceArea = [];
    provider.location = {};
    provider.availability = {};
    provider.workingHours = {};
    provider.garageImages = [];
    provider.accountHolderName = null;
    provider.accountNumber = null;
    provider.ifscCode = null;
    provider.bankName = null;
    provider.branchName = null;
    provider.upiId = null;
    provider.kycStatus = "pending";
    provider.rejectionReason = null;
    await provider.save();

    await Document.destroy({ where: { providerId } });

    res.json({
      success: true,
      message: "Provider onboarding has been reset",
      providerId: provider.id,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateKycStatus = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    if (req.body.kycStatus === "rejected" && req.body.rejectionReason) {
      provider.kycStatus = "rejected";
      provider.rejectionReason = req.body.rejectionReason;
    } else if (req.body.kycStatus === "verified") {
      provider.kycStatus = "verified";
      provider.rejectionReason = null;
    } else {
      return res.status(400).json({ error: "Invalid KYC status" });
    }
    await provider.save();
    res.json({
      success: true,
      data: provider.toJSON(),
      providerId: provider.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateGarageImageStatus = async (req, res, next) => {
  try {
    const { providerId, imageId } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const doc = await Document.findOne({
      where: { id: imageId, providerId, type: "garage_image" },
    });
    if (!doc) return res.status(404).json({ error: "Garage image not found" });

    doc.status = status;
    await doc.save();
    res.json({ success: true, data: doc.toJSON(), providerId });
  } catch (err) {
    next(err);
  }
};

exports.approveAllGarageImages = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const [count] = await Document.update(
      { status: "approved" },
      { where: { providerId, type: "garage_image" } }
    );
    res.json({ success: true, updated: count, providerId });
  } catch (err) {
    next(err);
  }
};

exports.rejectAllGarageImages = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const [count] = await Document.update(
      { status: "rejected" },
      { where: { providerId, type: "garage_image" } }
    );
    res.json({ success: true, updated: count, providerId });
  } catch (err) {
    next(err);
  }
};

exports.updateDocumentStatus = async (req, res, next) => {
  try {
    const { providerId, documentId } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const doc = await Document.findOne({
      where: { id: documentId, providerId, type: { [Op.not]: "garage_image" } },
    });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.status = status;
    await doc.save();
    res.json({ success: true, data: doc.toJSON(), providerId });
  } catch (err) {
    next(err);
  }
};

// Onboarding draft cache in-memory (for demo; swap with Redis for production)
const onboardingDraftCache = {};

exports.getOnboardingDraft = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const draft = onboardingDraftCache[providerId] || null;
    res.json({ success: true, draft, providerId });
  } catch (err) {
    next(err);
  }
};

exports.saveOnboardingDraft = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { draft } = req.body;
    onboardingDraftCache[providerId] = draft;
    res.json({ success: true, providerId });
  } catch (err) {
    next(err);
  }
};
