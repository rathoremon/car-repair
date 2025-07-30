const { SubscriptionPlan } = require("../models");

exports.createPlan = async (req, res, next) => {
  try {
    const { name, price, durationDays, features } = req.body;

    if (!name || !price || !durationDays) {
      return res
        .status(400)
        .json({ error: "Name, price, and duration are required" });
    }

    const plan = await SubscriptionPlan.create({
      name,
      price,
      durationDays,
      features,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [["price", "ASC"]],
    });

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};
