module.exports = (sequelize, DataTypes) => {
  const Payout = sequelize.define("Payout", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    scheduledDate: DataTypes.DATE,
  });
  return Payout;
};
