const { Dispute } = require("../models");

exports.createDispute = async (req, res, next) => {
  try {
    const { serviceRequestId, reason } = req.body;
    const dispute = await Dispute.create({
      userId: req.user.id,
      serviceRequestId,
      reason,
      status: "open",
    });
    res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    next(err);
  }
};

exports.resolveDispute = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Dispute.update(
      { status: "resolved" },
      { where: { id } }
    );

    if (!updated[0])
      return res.status(404).json({ error: "Dispute not found" });

    res.status(200).json({ success: true, message: "Dispute resolved" });
  } catch (err) {
    next(err);
  }
};
