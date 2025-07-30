const { Notification } = require("../models");

exports.createNotification = async ({ userId, title, message }) => {
  return Notification.create({ userId, title, message });
};

exports.getNotifications = async (userId) => {
  return Notification.findAll({ where: { userId } });
};
