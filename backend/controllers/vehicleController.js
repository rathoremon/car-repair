const path = require("path");
const fs = require("fs");
const { Vehicle } = require("../models");

// --- Helpers ---
const REGEX_REG = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
const FUEL_TYPES = new Set([
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "CNG",
  "LPG",
]);

// Accept "DD-MM-YYYY", "YYYY-MM-DD", ISO, or empty → null
function parseDateAny(input) {
  if (!input) return null;
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  // DD-MM-YYYY
  const dd = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (dd) {
    const [, d, m, y] = dd;
    const iso = `${y}-${m}-${d}`;
    return isNaN(new Date(iso)) ? null : iso;
  }

  // YYYY-MM-DD or ISO
  const iso = s.split("T")[0];
  return isNaN(new Date(iso)) ? null : iso;
}

function pickVehicleFields(body) {
  const fields = [
    "photoUrl",
    "make",
    "model",
    "year",
    "carType",
    "registrationNumber",
    "vin",
    "engineNumber",
    "fuelType",
    "ownerName",
    "ownerMobile",
    "ownerEmail",
    "insuranceCompany",
    "policyNumber",
    "insuranceType",
    "premiumAmount",
    "insuranceStartDate",
    "insuranceExpiryDate",
    "insuranceContact",
    "pucCertificateNo",
    "pucValidityDate",
    "roadTaxCertificateNo",
    "roadTaxValidityDate",
    "lastServiceDate",
    "lastServiceKM",
    "nextServiceDueDate",
    "nextServiceDueKM",
    "oilChangeDate",
    "oilChangeKM",
    "batteryChangeDate",
    "tyreChangeDate",
    "brakeInspectionDate",
    "suspensionCheckDate",
    "wheelAlignmentDate",
    "transmissionOilChangeDate",
    "avgMonthlyKM",
    "insuranceReminderDate",
    "pucReminderDate",
    "nextServiceReminderDate",
  ];

  const data = {};
  for (const k of fields) if (body[k] !== undefined) data[k] = body[k];

  // Coerce
  if (data.registrationNumber)
    data.registrationNumber = String(data.registrationNumber).toUpperCase();
  if (data.year !== undefined) data.year = Number(data.year) || null;
  if (data.lastServiceKM !== undefined)
    data.lastServiceKM = Number(data.lastServiceKM) || null;
  if (data.nextServiceDueKM !== undefined)
    data.nextServiceDueKM = Number(data.nextServiceDueKM) || null;
  if (data.oilChangeKM !== undefined)
    data.oilChangeKM = Number(data.oilChangeKM) || null;
  if (data.premiumAmount !== undefined)
    data.premiumAmount = Number(data.premiumAmount) || null;
  if (data.avgMonthlyKM !== undefined)
    data.avgMonthlyKM = Number(data.avgMonthlyKM) || null;

  // Dates → DATEONLY (YYYY-MM-DD)
  const dateKeys = [
    "insuranceStartDate",
    "insuranceExpiryDate",
    "pucValidityDate",
    "roadTaxValidityDate",
    "lastServiceDate",
    "nextServiceDueDate",
    "oilChangeDate",
    "batteryChangeDate",
    "tyreChangeDate",
    "brakeInspectionDate",
    "suspensionCheckDate",
    "wheelAlignmentDate",
    "transmissionOilChangeDate",
    "insuranceReminderDate",
    "pucReminderDate",
    "nextServiceReminderDate",
  ];
  for (const dk of dateKeys) {
    if (data[dk] !== undefined) data[dk] = parseDateAny(data[dk]);
  }

  return data;
}

function validateRequiredCore(data) {
  const errors = [];
  const now = new Date().getFullYear();
  const minYear = 1980;
  const maxYear = now + 1;

  if (!data.make) errors.push("make is required");
  if (!data.model) errors.push("model is required");
  if (!data.year) errors.push("year is required");
  if (data.year && (data.year < minYear || data.year > maxYear))
    errors.push(`year must be between ${minYear} and ${maxYear}`);
  if (!data.registrationNumber) errors.push("registrationNumber is required");
  else if (!REGEX_REG.test(data.registrationNumber))
    errors.push("registrationNumber must match AA00AA0000");
  if (!data.fuelType) errors.push("fuelType is required");
  else if (!FUEL_TYPES.has(String(data.fuelType)))
    errors.push(`fuelType must be one of ${Array.from(FUEL_TYPES).join(", ")}`);

  return errors;
}

// --- Controllers ---
exports.addVehicle = async (req, res, next) => {
  try {
    const data = pickVehicleFields(req.body);
    const errors = validateRequiredCore(data);
    if (errors.length)
      return res.status(400).json({ error: errors.join(", ") });

    const vehicle = await Vehicle.create({ ...data, userId: req.user.id });
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const v = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!v) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ success: true, data: v });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const data = pickVehicleFields(req.body);
    // Only validate core fields if any of them are being changed
    const touchedCore = [
      "make",
      "model",
      "year",
      "registrationNumber",
      "fuelType",
    ].some((k) => k in data);
    if (touchedCore) {
      const merged = { ...vehicle.toJSON(), ...data };
      const errors = validateRequiredCore(merged);
      if (errors.length)
        return res.status(400).json({ error: errors.join(", ") });
    }

    await vehicle.update(data);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const deleted = await Vehicle.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ error: "Vehicle not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// helper: delete old file if present (works with relative or absolute paths)
function removeIfExists(relOrAbsPath) {
  if (!relOrAbsPath) return;
  try {
    const abs = path.isAbsolute(relOrAbsPath)
      ? relOrAbsPath
      : path.join(__dirname, "..", relOrAbsPath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (_) {}
}

// POST /api/vehicles/:id/photo
exports.uploadVehiclePhoto = async (req, res, next) => {
  try {
    // ensure vehicle belongs to this user
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // remove old photo if any
    removeIfExists(vehicle.photoUrl);

    // store a RELATIVE path so you can serve it statically
    const relPath = path
      .join("uploads", "documents", req.file.filename)
      .replace(/\\/g, "/");

    await vehicle.update({ photoUrl: relPath });

    return res.status(200).json({
      success: true,
      message: "Vehicle photo uploaded",
      data: vehicle, // updated record
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/vehicles/:id/photo
exports.deleteVehiclePhoto = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    removeIfExists(vehicle.photoUrl);
    await vehicle.update({ photoUrl: null });

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
