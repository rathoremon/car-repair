module.exports = (sequelize, DataTypes) => {
  const BNPLRequest = sequelize.define("BNPLRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    approvedBy: DataTypes.UUID,
  });
  return BNPLRequest;
};
