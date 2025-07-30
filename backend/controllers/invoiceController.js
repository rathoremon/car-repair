const { Invoice } = require("../models");

exports.createInvoice = async (req, res, next) => {
  try {
    const {
      userId,
      providerId,
      serviceRequestId,
      breakdown,
      parts,
      total,
      markup,
      finalAmount,
      status,
    } = req.body;

    if (!userId || !providerId || !serviceRequestId || !total) {
      return res.status(400).json({ error: "Missing required invoice fields" });
    }

    const invoice = await Invoice.create({
      userId,
      providerId,
      serviceRequestId,
      breakdown,
      parts,
      total,
      markup: markup || 0,
      finalAmount: finalAmount || total,
      status: status || "pending",
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

exports.getInvoicesByUser = async (req, res, next) => {
  try {
    const invoices = await Invoice.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};
