const { TierPlan } = require("../models");

exports.createPlan = async (req, res, next) => {
  try {
    const { name, slaMinutes, priorityLevel, discountRate, providerId } =
      req.body;

    if (!name || !slaMinutes || !priorityLevel) {
      return res
        .status(400)
        .json({ error: "Name, SLA, and priority level are required" });
    }

    const plan = await TierPlan.create({
      name,
      slaMinutes,
      priorityLevel,
      discountRate: discountRate || 0,
      providerId,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await TierPlan.findAll({
      where: { providerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await TierPlan.findByPk(id);

    if (!plan || plan.providerId !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Tier plan not found or unauthorized" });
    }

    await plan.update(req.body);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};
