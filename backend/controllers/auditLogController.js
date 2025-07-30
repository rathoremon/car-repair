const { AuditLog } = require("../models");

exports.logAction = async (req, res, next) => {
  try {
    const { action, target } = req.body;
    const adminId = req.user.id;

    const log = await AuditLog.create({ adminId, action, target });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};
