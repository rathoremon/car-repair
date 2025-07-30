module.exports = (sequelize, DataTypes) => {
  const ServiceRequest = sequelize.define("ServiceRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    breakdownType: DataTypes.STRING,
    location: DataTypes.JSONB,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
  });
  return ServiceRequest;
};
