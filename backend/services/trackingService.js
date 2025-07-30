const { Tracking } = require("../models");

exports.updateLocation = async (assignmentId, coords) => {
  return Tracking.upsert({ assignmentId, ...coords });
};

exports.getLocation = async (assignmentId) => {
  return Tracking.findOne({ where: { assignmentId } });
};
