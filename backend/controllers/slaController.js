const { SLALog } = require("../models");

exports.logSLAEvent = async (req, res, next) => {
  try {
    const { assignmentId, providerId, mechanicId, responseTime, slaBreached } =
      req.body;

    if (!assignmentId || !providerId || responseTime === undefined) {
      return res.status(400).json({ error: "Missing required SLA log fields" });
    }

    const log = await SLALog.create({
      assignmentId,
      providerId,
      mechanicId,
      responseTime,
      slaBreached: slaBreached || false,
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

exports.getSLAStats = async (req, res, next) => {
  try {
    const logs = await SLALog.findAll({
      where: { providerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
