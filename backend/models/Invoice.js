module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    serviceRequestId: DataTypes.UUID,
    providerId: DataTypes.UUID,
    userId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    markup: DataTypes.DECIMAL,
    isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  return Invoice;
};
