const { User, Provider, Mechanic, Document, Sequelize } = require("../models");
const { Op } = Sequelize;

// --- 1. GET ALL USERS (for admin dashboard) ---
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// --- 2. GET ALL MECHANICS (with providers) ---
exports.getAllMechanics = async (req, res, next) => {
  try {
    const mechanics = await Mechanic.findAll({
      include: [{ model: Provider, attributes: ["id", "companyName"] }],
    });
    res.json({ success: true, data: mechanics });
  } catch (err) {
    next(err);
  }
};

// --- 3. GET ALL PROVIDERS (ADMIN TABLE: pagination, search, sort) ---
exports.getAllProviders = async (req, res) => {
  try {
    const {
      search = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    let userInclude = [];
    let realSearchFilter = {};

    if (search && search.trim()) {
      userInclude = [
        {
          model: User,
          attributes: [],
          required: true,
        },
      ];
      realSearchFilter = {
        [Op.or]: [
          { companyName: { [Op.iLike]: `%${search}%` } },
          { "$User.name$": { [Op.iLike]: `%${search}%` } },
          { "$User.phone$": { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    let orderArr = [];
    if (sortBy === "requested" || sortBy === "createdAt") {
      orderArr = [
        ["createdAt", order.toLowerCase() === "asc" ? "ASC" : "DESC"],
      ];
    } else if (["companyName", "tier", "kycStatus"].includes(sortBy)) {
      orderArr = [[sortBy, order.toLowerCase() === "asc" ? "ASC" : "DESC"]];
    }

    // COUNT
    const total = await Provider.count({
      where: realSearchFilter,
      include: userInclude,
    });

    // PROVIDERS (for table)
    const providers = await Provider.findAll({
      where: realSearchFilter,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone", "onboardingComplete"],
          required: !!(search && search.trim()), // Only force join if searching
        },
        {
          model: Document,
          attributes: [
            "id",
            "type",
            "filePath",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
      order: orderArr,
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
    });

    res.json({
      success: true,
      data: {
        providers,
        pagination: {
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 4. UPDATE PROVIDER KYC STATUS (approve/reject) ---
// PATCH /api/admin/providers/:providerId/kyc
exports.updateProviderKYC = async (req, res) => {
  const { providerId } = req.params;
  const { kycStatus, rejectionReason } = req.body;
  try {
    const provider = await Provider.findByPk(providerId, {
      include: [{ model: User }],
    });
    if (!provider)
      return res
        .status(404)
        .json({ success: false, error: "Provider not found" });

    if (!["verified", "rejected", "pending"].includes(kycStatus)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid KYC status" });
    }

    provider.kycStatus = kycStatus;
    provider.rejectionReason =
      kycStatus === "rejected" ? rejectionReason : null;
    await provider.save();

    // Optionally update User status
    if (provider.User) {
      provider.User.status = kycStatus === "verified" ? "active" : kycStatus;
      await provider.User.save();
    }

    // Return updated provider with user
    const updatedProvider = await Provider.findByPk(providerId, {
      include: [{ model: User }],
    });
    return res.status(200).json({ success: true, data: updatedProvider });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 5. APPROVE/REJECT SINGLE GARAGE IMAGE ---
exports.updateGarageImageStatus = async (req, res) => {
  const { providerId, imageId } = req.params;
  const { status } = req.body; // "approved" or "rejected"
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, error: "Invalid status" });

  try {
    const doc = await Document.findOne({
      where: { id: imageId, providerId, type: "garage_image" },
    });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, error: "Garage image not found" });

    doc.status = status;
    await doc.save();

    return res.json({ success: true, data: { providerId, imageId, status } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 6. BULK APPROVE/REJECT ALL GARAGE IMAGES ---
exports.bulkUpdateGarageImages = async (req, res, next, status) => {
  const { providerId } = req.params;
  try {
    const images = await Document.update(
      { status },
      { where: { providerId, type: "garage_image" } }
    );
    return res.json({ success: true, data: { providerId } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 7. APPROVE/REJECT SINGLE KYC DOCUMENT ---
exports.updateDocumentStatus = async (req, res) => {
  const { providerId, documentId } = req.params;
  const { status } = req.body; // "approved" or "rejected"
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, error: "Invalid status" });

  try {
    const doc = await Document.findOne({
      where: { id: documentId, providerId },
    });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, error: "Document not found" });

    doc.status = status;
    await doc.save();

    return res.json({
      success: true,
      data: { providerId, documentId, status },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
