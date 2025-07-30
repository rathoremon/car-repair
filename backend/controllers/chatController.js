const { Chat } = require("../models");

exports.getChatMessages = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const messages = await Chat.findAll({
      where: { assignmentId },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { assignmentId, message, messageType, receiverId } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message content required" });

    const chat = await Chat.create({
      assignmentId,
      senderId: req.user.id,
      receiverId,
      message,
      messageType: messageType || "text",
    });

    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    next(err);
  }
};
