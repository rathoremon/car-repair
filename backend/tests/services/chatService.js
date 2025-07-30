const { Chat } = require("../models");

exports.storeMessage = async (data) => {
  return Chat.create(data);
};

exports.fetchMessages = async (assignmentId) => {
  return Chat.findAll({ where: { assignmentId } });
};
