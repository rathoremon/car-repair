module.exports = (sequelize, DataTypes) => {
  const TierPlan = sequelize.define("TierPlan", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    responseTime: DataTypes.INTEGER,
    coverageArea: DataTypes.STRING,
    discountRate: DataTypes.FLOAT,
  });
  return TierPlan;
};
