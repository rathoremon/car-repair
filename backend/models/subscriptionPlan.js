module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    durationDays: DataTypes.INTEGER,
    features: DataTypes.JSONB,
  });
  return SubscriptionPlan;
};
