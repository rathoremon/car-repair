const { Notification } = require("../models");

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notification = await Notification.create({
      userId: req.user.id,
      title,
      message,
      type: type || "info",
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Notification.update(
      { read: true },
      { where: { id, userId: req.user.id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
