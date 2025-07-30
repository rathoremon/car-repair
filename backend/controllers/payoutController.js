const { Payout } = require("../models");

exports.getPayouts = async (req, res, next) => {
  try {
    const payouts = await Payout.findAll({
      where: { providerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: payouts });
  } catch (err) {
    next(err);
  }
};

exports.schedulePayout = async (req, res, next) => {
  try {
    const { amount, payoutDate, status } = req.body;

    if (!amount || !payoutDate) {
      return res
        .status(400)
        .json({ error: "Amount and payout date are required" });
    }

    const payout = await Payout.create({
      providerId: req.user.id,
      amount,
      payoutDate,
      status: status || "scheduled",
    });

    res.status(201).json({ success: true, data: payout });
  } catch (err) {
    next(err);
  }
};
