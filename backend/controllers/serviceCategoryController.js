const { ServiceCategory, Skill } = require("../models");
const { Op } = require("sequelize");

exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      isEmergencyService,
      defaultDuration,
      pinned,
      isActive,
      notes,
      skillIds, // array of skill UUIDs
    } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const category = await ServiceCategory.create({
      name: name.trim(),
      description,
      isEmergencyService: !!isEmergencyService,
      defaultDuration: parseInt(defaultDuration) || null,
      pinned: !!pinned,
      status: isActive === false ? "inactive" : "active",
      notes: notes || "",
    });

    // 🆕 Assign skills if skillIds array is given
    if (Array.isArray(skillIds) && skillIds.length > 0) {
      await category.setSkills(skillIds);
    }

    // Return with skills included
    const withSkills = await ServiceCategory.findByPk(category.id, {
      include: [{ model: Skill, as: "skills" }],
    });

    return res.status(201).json({ success: true, data: withSkills });
  } catch (err) {
    console.error("Create Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const {
      search,
      status,
      emergency,
      sortBy,
      sortDir,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (status && ["active", "inactive"].includes(status))
      where.status = status;
    if (emergency === "true" || emergency === "false") {
      where.isEmergencyService = emergency === "true";
    }

    const offset = (Number(page) - 1) * Number(limit);
    const order = [
      [sortBy || "name", sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];

    const { rows, count } = await ServiceCategory.findAndCountAll({
      where,
      order,
      limit: Number(limit),
      offset,
      paranoid: false,
      include: [{ model: Skill, as: "skills" }], // 🆕 Always include skills
    });

    return res.json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    console.error("Get Categories Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      isEmergencyService,
      defaultDuration,
      status,
      pinned,
      notes,
      skillIds, // array of skill UUIDs
    } = req.body;

    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Service category not found" });
    }

    category.name = name?.trim() || category.name;
    category.description = description ?? category.description;
    category.status = status ?? category.status;
    category.isEmergencyService =
      typeof isEmergencyService !== "undefined"
        ? isEmergencyService
        : category.isEmergencyService;
    category.defaultDuration = defaultDuration ?? category.defaultDuration;
    category.pinned = typeof pinned !== "undefined" ? pinned : category.pinned;
    category.notes = notes ?? category.notes;

    await category.save();

    // 🆕 Update skills if skillIds array is given
    if (Array.isArray(skillIds)) {
      await category.setSkills(skillIds);
    }

    const withSkills = await ServiceCategory.findByPk(category.id, {
      include: [{ model: Skill, as: "skills" }],
    });

    return res.status(200).json({ success: true, data: withSkills });
  } catch (err) {
    console.error("Update Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { hard } = req.query;
    const category = await ServiceCategory.findByPk(req.params.id, {
      paranoid: !hard,
    });

    if (!category) return res.status(404).json({ error: "Not found" });

    await category.destroy({ force: hard === "true" });
    return res.json({
      success: true,
      message: hard === "true" ? "Hard-deleted" : "Soft-deleted",
    });
  } catch (err) {
    console.error("Delete Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByPk(req.params.id, {
      paranoid: false,
    });

    if (!category) return res.status(404).json({ error: "Not found" });

    await category.restore();

    // 🆕 Return with skills
    const withSkills = await ServiceCategory.findByPk(category.id, {
      include: [{ model: Skill, as: "skills" }],
    });

    res.json({ success: true, data: withSkills });
  } catch (err) {
    console.error("Restore Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
