const { Payment } = require("../models");

exports.pay = async (req, res, next) => {
  try {
    const { method, amount, transactionId, status } = req.body;

    if (!method || !amount) {
      return res
        .status(400)
        .json({ error: "Payment method and amount are required" });
    }

    const payment = await Payment.create({
      userId: req.user.id,
      method,
      amount,
      transactionId,
      status: status || "pending",
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// exports.pay = async (req, res, next) => {
//   try {
//     const { amount, currency = "inr", payment_method_id } = req.body;

//     if (!payment_method_id || !amount) {
//       return res
//         .status(400)
//         .json({ error: "Missing payment method or amount." });
//     }

//     // Create a Stripe payment intent
//     const intent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Stripe uses paise
//       currency,
//       payment_method: payment_method_id,
//       confirmation_method: "manual",
//       confirm: true,
//     });

//     // Save in DB
//     const payment = await Payment.create({
//       userId: req.user.id,
//       amount,
//       method: "stripe",
//       transactionId: intent.id,
//       status: intent.status,
//     });

//     res.status(200).json({ success: true, payment, intent });
//   } catch (err) {
//     next(err);
//   }
// };

exports.summary = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};

exports.invoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};
