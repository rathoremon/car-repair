module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    method: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    transactionId: DataTypes.STRING,
  });
  return Payment;
};
