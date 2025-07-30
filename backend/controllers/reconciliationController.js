const { Invoice } = require("../models");

exports.getProviderInvoices = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const invoices = await Invoice.findAll({
      where: { providerId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.addMarkup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { markup } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    await invoice.update({ markup });
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    await invoice.update({ isPaid: true });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
