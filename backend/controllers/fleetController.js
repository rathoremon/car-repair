const { Vehicle } = require("../models");

exports.getFleet = async (req, res, next) => {
  try {
    const fleet = await Vehicle.findAll({
      where: { corporateAccount: true },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: fleet });
  } catch (error) {
    next(error);
  }
};

exports.addFleetVehicle = async (req, res, next) => {
  try {
    const { make, model, year, registrationNumber } = req.body;

    if (!make || !model || !year || !registrationNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const vehicle = await Vehicle.create({
      userId: req.user.id,
      make,
      model,
      year,
      registrationNumber,
      corporateAccount: true,
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};
