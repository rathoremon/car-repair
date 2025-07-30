const { ServiceRequest } = require("../models");

exports.createRequest = async (req, res, next) => {
  try {
    const { breakdownType, location, description } = req.body;

    if (!breakdownType || !location) {
      return res
        .status(400)
        .json({ error: "Breakdown type and location are required" });
    }

    const request = await ServiceRequest.create({
      userId: req.user.id,
      breakdownType,
      location,
      description,
      status: "new",
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

exports.getUserRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
};
