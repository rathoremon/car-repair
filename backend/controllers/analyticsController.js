const { AnalyticsRecord } = require("../models");

exports.logAnalytics = async (req, res, next) => {
  try {
    const { eventType, source, payload } = req.body;
    const record = await AnalyticsRecord.create({ eventType, source, payload });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const records = await AnalyticsRecord.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};
