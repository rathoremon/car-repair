const { BNPLRequest } = require("../models");

exports.requestBNPL = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const existing = await BNPLRequest.findOne({
      where: { userId: req.user.id, status: "pending" },
    });
    if (existing)
      return res
        .status(409)
        .json({ error: "You already have a pending request" });

    const request = await BNPLRequest.create({
      userId: req.user.id,
      amount,
      status: "pending",
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

exports.getBNPLStatus = async (req, res, next) => {
  try {
    const request = await BNPLRequest.findOne({
      where: { userId: req.user.id },
    });
    if (!request)
      return res.status(404).json({ error: "No BNPL record found" });

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};
