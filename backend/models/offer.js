module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define("Offer", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: DataTypes.UUID,
    code: DataTypes.STRING,
    description: DataTypes.TEXT,
    eligibility: DataTypes.JSONB,
    active: DataTypes.BOOLEAN,
  });
  return Offer;
};
