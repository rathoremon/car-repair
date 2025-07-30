module.exports = (sequelize, DataTypes) => {
  const DynamicPricingRule = sequelize.define("DynamicPricingRule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    zone: DataTypes.STRING,
    multiplier: DataTypes.FLOAT,
    activeTime: DataTypes.RANGE(DataTypes.DATE),
  });
  return DynamicPricingRule;
};
