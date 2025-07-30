const { Vehicle } = require("../models");

exports.addVehicle = async (req, res, next) => {
  try {
    const { make, model, year, registrationNumber, fuelType } = req.body;

    if (!make || !model || !year || !registrationNumber || !fuelType) {
      return res.status(400).json({ error: "All vehicle fields are required" });
    }

    const vehicle = await Vehicle.create({
      userId: req.user.id,
      make,
      model,
      year,
      registrationNumber,
      fuelType,
    });
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

exports.updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({
      where: { id, userId: req.user.id },
    });

    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    await vehicle.update(req.body);
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Vehicle.destroy({
      where: { id, userId: req.user.id },
    });

    if (!deleted) return res.status(404).json({ error: "Vehicle not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
