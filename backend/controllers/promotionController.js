// controllers/promotionController.js

const { Promotion } = require("../models");
const { Op } = require("sequelize");

// Utility to validate banner dates
const isValidDateRange = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate);
};

// ✅ Create Banner
exports.createPromotion = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      imageUrl,
      redirectUrl,
      ctaText,
      ctaUrl,
      metadata,
      startDate,
      endDate,
      status,
    } = req.body;

    if (!type || !startDate || !endDate || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidDateRange(startDate, endDate)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    if (
      type === "promotion" &&
      (!title || !description || !ctaText || !ctaUrl)
    ) {
      return res
        .status(400)
        .json({ message: "Missing required promotion fields" });
    }

    if (type === "image" && !imageUrl) {
      return res
        .status(400)
        .json({ message: "Image URL is required for image type" });
    }

    const newBanner = await Promotion.create({
      type,
      title,
      description,
      imageUrl,
      redirectUrl,
      ctaText,
      ctaUrl,
      metadata,
      startDate,
      endDate,
      status,
    });

    res.status(201).json({ success: true, data: newBanner });
  } catch (err) {
    console.error("Create Promotion Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Banners (Admin View)
exports.getAllPromotions = async (req, res) => {
  try {
    await autoDeactivateExpiredPromotions(); // << auto-inactivate expired
    const banners = await Promotion.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    console.error("Fetch Promotions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Active Banners (Public / PWA)
exports.getActivePromotions = async (req, res) => {
  try {
    await autoDeactivateExpiredPromotions(); // << auto-inactivate expired
    const now = new Date();

    const banners = await Promotion.findAll({
      where: {
        status: "active",
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
      order: [["startDate", "ASC"]],
    });

    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    console.error("Fetch Active Promotions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Banner
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      title,
      description,
      imageUrl,
      redirectUrl,
      ctaText,
      ctaUrl,
      metadata,
      startDate,
      endDate,
      status,
    } = req.body;

    const existing = await Promotion.findByPk(id);
    if (!existing)
      return res.status(404).json({ message: "Promotion not found" });

    if (!isValidDateRange(startDate, endDate)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    await existing.update({
      type,
      title,
      description,
      imageUrl,
      redirectUrl,
      ctaText,
      ctaUrl,
      metadata,
      startDate,
      endDate,
      status,
    });

    res.status(200).json({ success: true, data: existing });
  } catch (err) {
    console.error("Update Promotion Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Banner
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Promotion.findByPk(id);
    if (!banner)
      return res.status(404).json({ message: "Promotion not found" });

    await banner.destroy();
    res.status(200).json({ success: true, message: "Banner deleted" });
  } catch (err) {
    console.error("Delete Promotion Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// In controllers/promotionController.js

const autoDeactivateExpiredPromotions = async () => {
  const now = new Date();
  await Promotion.update(
    { status: "inactive" },
    {
      where: {
        status: "active",
        endDate: { [Op.lt]: now },
      },
    }
  );
};
