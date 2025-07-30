const { Tracking } = require("../models");

exports.updateLocation = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { latitude, longitude, status } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const [location] = await Tracking.upsert({
      assignmentId,
      latitude,
      longitude,
      status,
    });

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const location = await Tracking.findOne({
      where: { assignmentId },
    });

    if (!location) return res.status(404).json({ error: "Location not found" });

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};
