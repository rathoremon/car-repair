const { Payment } = require("../models");

exports.initiatePayment = async (data) => {
  return Payment.create(data);
};

exports.getUserPayments = async (userId) => {
  return Payment.findAll({ where: { userId } });
};
