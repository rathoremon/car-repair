const { Mechanic, User, sequelize } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// Helper: Parse possibly stringified arrays or JSON
function parseMaybeJSON(val, fallback = undefined) {
  if (Array.isArray(val)) return val;
  if (typeof val === "object" && val !== null) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
}

// --- List Mechanics ---
exports.listMechanics = async (req, res, next) => {
  try {
    // Only allow providers to fetch their mechanics
    if (!req.user || !req.user.providerId) {
      return res.status(403).json({ error: "Provider access required" });
    }

    const providerId = req.user.providerId;
    let { search = "", status, page = 1, limit = 20 } = req.query;

    // Defensive: ensure valid page/limit
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    // Build dynamic where
    const where = { providerId };
    if (search && search.trim()) {
      const safe = search.trim();
      where[Op.or] = [
        { name: { [Op.iLike]: `%${safe}%` } },
        { email: { [Op.iLike]: `%${safe}%` } },
        { phone: { [Op.iLike]: `%${safe}%` } },
      ];
    }
    if (status) {
      if (Array.isArray(status)) {
        // Allows status=in=active,pending style or multiple checkboxes in UI
        where.status = { [Op.in]: status };
      } else {
        where.status = status;
      }
    }

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder =
      req.query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { rows, count } = await Mechanic.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      mechanics: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    // Log for debugging in dev (optional: remove in prod)
    console.error("[listMechanics] Error:", err);
    next(err);
  }
};

// --- Get Mechanic by ID ---
exports.getMechanic = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    if (mechanic.providerId !== req.user.providerId)
      return res.status(403).json({ error: "Forbidden" });
    res.json({ mechanic });
  } catch (err) {
    next(err);
  }
};

// --- Add Mechanic ---
exports.addMechanic = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    if (!req.user.providerId)
      return res.status(403).json({ error: "Provider access required" });

    const providerId = req.user.providerId;
    let {
      name,
      email,
      phone,
      aadhar,
      skillSet,
      experience,
      address,
      availability,
    } = req.body;

    // Defensive log for debugging
    console.log("[Mechanic POST]", {
      providerId,
      skillSet,
      type: typeof skillSet,
      experience,
      address,
      availability,
      file: !!req.file,
    });

    // Validate required fields
    if (!name || !email || !phone)
      return res.status(400).json({ error: "Name, email, and phone required" });

    // Parse complex fields
    const skillsArr = parseMaybeJSON(skillSet, []);
    if (!Array.isArray(skillsArr))
      return res.status(400).json({ error: "Invalid skillSet data" });

    const availObj = parseMaybeJSON(availability, {});
    const addressObj = parseMaybeJSON(address, address);

    // File (photo) handling
    let photo = null;
    if (req.file) photo = `/uploads/documents/${req.file.filename}`;

    // Check duplicate email/phone
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
      transaction: t,
    });
    if (existingUser) {
      if (req.file && req.file.path) fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(409).json({ error: "Email or phone already in use" });
    }

    // Create mechanic user (temp password)
    const tempPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create(
      {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "mechanic",
        isOtpVerified: false,
        onboardingComplete: false,
      },
      { transaction: t }
    );

    // Mechanic row
    const mechanic = await Mechanic.create(
      {
        userId: user.id,
        providerId,
        name,
        email,
        phone,
        aadhar,
        skillSet: skillsArr,
        experience: experience ? Number(experience) : null,
        address: addressObj,
        availability: availObj,
        photo,
        status: "pending",
      },
      { transaction: t }
    );

    await t.commit();

    // NEVER send password in prod
    const result = { mechanic, message: "Mechanic created and invited" };
    if (process.env.NODE_ENV !== "production") {
      result.tempPassword = tempPassword;
    }

    res.status(201).json(result);
  } catch (err) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    await t.rollback();
    console.error("[MechanicController:addMechanic] error:", err);
    // Expose only safe error details
    if (
      err.name === "SequelizeUniqueConstraintError" ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return res
        .status(409)
        .json({ error: err.errors?.[0]?.message || "Constraint violation" });
    }
    res.status(500).json({
      error: "Could not create mechanic. Check input and try again.",
      details: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }
};

// --- Update Mechanic ---
exports.updateMechanic = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    if (mechanic.providerId !== req.user.providerId)
      return res.status(403).json({ error: "Forbidden" });

    const {
      name,
      phone,
      skillSet,
      experience,
      address,
      availability,
      aadhar,
      status,
    } = req.body;

    if (name) mechanic.name = name;
    if (phone) mechanic.phone = phone;
    if (aadhar) mechanic.aadhar = aadhar;
    if (skillSet) {
      const skillsArr = parseMaybeJSON(skillSet, []);
      if (!Array.isArray(skillsArr)) throw new Error("Invalid skillSet data");
      mechanic.skillSet = skillsArr;
    }
    if (experience !== undefined) mechanic.experience = Number(experience);
    if (address !== undefined)
      mechanic.address = parseMaybeJSON(address, address);
    if (availability !== undefined)
      mechanic.availability = parseMaybeJSON(availability, availability);
    if (status) mechanic.status = status;

    if (req.file) {
      if (mechanic.photo) {
        try {
          fs.unlinkSync(path.join(__dirname, "..", mechanic.photo));
        } catch (e) {}
      }
      mechanic.photo = `/uploads/documents/${req.file.filename}`;
    }

    await mechanic.save();
    res.json({ mechanic });
  } catch (err) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    next(err);
  }
};

// --- Delete Mechanic ---
exports.deleteMechanic = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    if (mechanic.providerId !== req.user.providerId)
      return res.status(403).json({ error: "Forbidden" });
    if (mechanic.photo) {
      try {
        fs.unlinkSync(path.join(__dirname, "..", mechanic.photo));
      } catch (e) {}
    }
    await mechanic.destroy();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// --- Reset Password ---
const resetCache = new Map();

exports.resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { generateNew = false } = req.body;
    const userId = req.user.id;
    const providerId = req.user.providerId;

    const mechanic = await Mechanic.findByPk(id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    if (mechanic.providerId !== providerId)
      return res.status(403).json({ error: "Forbidden" });

    const user = await User.findByPk(mechanic.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isSelfMechanic = user.id === userId;

    // ✅ If self-mechanic and no generation requested
    if (isSelfMechanic && !generateNew) {
      return res.json({
        success: true,
        tempPassword: "Same as your provider login password",
        message: "Mechanic uses the same password as your provider account",
      });
    }

    // ✅ If not generateNew and password already cached
    if (!generateNew && resetCache.has(id)) {
      return res.json({
        success: true,
        tempPassword: resetCache.get(id),
        message: "Previously generated password",
      });
    }

    // ✅ Generate new password
    const tempPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedPassword;
    await user.save();

    resetCache.set(id, tempPassword); // Cache new password

    res.json({
      success: true,
      tempPassword,
      message: "Mechanic password reset",
    });
  } catch (err) {
    console.error("[resetPassword] error:", err);
    next(err);
  }
};

// --- Get Mechanic for self-registration check ---
exports.getSelfMechanic = async (req, res, next) => {
  try {
    const { id: userId, providerId } = req.user;
    const mechanic = await Mechanic.findOne({ where: { userId } });

    // ✅ Instead of 404, return null mechanic
    if (!mechanic) {
      console.warn(`[getSelfMechanic] No mechanic found for user ${userId}`);
      return res.json({ mechanic: null });
    }

    if (mechanic.providerId !== providerId) {
      console.warn(`[getSelfMechanic] Mechanic belongs to another provider`);
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ mechanic });
  } catch (err) {
    console.error("[getSelfMechanic] error:", err);
    next(err);
  }
};

exports.registerSelfMechanic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const providerId = req.user.providerId;

    const mechanic = await Mechanic.findOne({
      where: { userId, providerId },
    });

    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });

    const {
      name,
      phone,
      skillSet,
      experience,
      address,
      availability,
      aadhar,
      status,
    } = req.body;

    if (name) mechanic.name = name;
    if (phone) mechanic.phone = phone;
    if (aadhar) mechanic.aadhar = aadhar;
    if (skillSet) {
      const skillsArr = parseMaybeJSON(skillSet, []);
      if (!Array.isArray(skillsArr)) throw new Error("Invalid skillSet data");
      mechanic.skillSet = skillsArr;
    }
    if (experience !== undefined) mechanic.experience = Number(experience);
    if (address !== undefined)
      mechanic.address = parseMaybeJSON(address, address);
    if (availability !== undefined)
      mechanic.availability = parseMaybeJSON(availability, availability);
    if (status) mechanic.status = status;

    if (req.file) {
      if (mechanic.photo) {
        try {
          fs.unlinkSync(path.join(__dirname, "..", mechanic.photo));
        } catch (e) {}
      }
      mechanic.photo = `/uploads/documents/${req.file.filename}`;
    }

    await mechanic.save();
    res.json({ mechanic });
  } catch (err) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.updateSelfMechanic = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id || !req.user.providerId) {
      return res
        .status(403)
        .json({ error: "Provider context missing or invalid" });
    }
    let mechanic = await Mechanic.findOne({
      where: { userId: req.user.id },
      paranoid: false,
    });

    const {
      name,
      email,
      phone,
      skillSet,
      experience,
      address,
      availability,
      aadhar,
      status,
    } = req.body;

    const photoPath = req.file
      ? `/uploads/documents/${req.file.filename}`
      : undefined;

    if (!mechanic) {
      const userExists = await User.findByPk(req.user.id);
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }

      mechanic = await Mechanic.create({
        userId: req.user.id,
        providerId: req.user.providerId,
        name,
        phone,
        email,
        aadhar,
        skillSet: parseMaybeJSON(skillSet, []),
        experience,
        address: parseMaybeJSON(address, {}),
        availability: parseMaybeJSON(availability, {}),
        status: status || "pending",
        photo: photoPath || null,
      });
    } else {
      if (mechanic.deletedAt) {
        await mechanic.restore(); // Sequelize restore

        mechanic.setDataValue("deletedAt", null);
      }
      // 👇 Update existing
      mechanic.name = name || mechanic.name;
      mechanic.phone = phone || mechanic.phone;
      mechanic.aadhar = aadhar || mechanic.aadhar;
      mechanic.skillSet = parseMaybeJSON(skillSet, mechanic.skillSet);
      mechanic.experience = experience ?? mechanic.experience;
      mechanic.address = parseMaybeJSON(address, mechanic.address);
      mechanic.availability = parseMaybeJSON(
        availability,
        mechanic.availability
      );
      if (status) mechanic.status = status;
      if (photoPath) {
        if (mechanic.photo) {
          try {
            fs.unlinkSync(path.join(__dirname, "..", mechanic.photo));
          } catch (e) {}
        }
        mechanic.photo = photoPath;
      }
      await mechanic.save();
    }

    res.json({ mechanic });
  } catch (err) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    next(err);
  }
};
