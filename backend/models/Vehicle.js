module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define("Vehicle", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    registrationNumber: DataTypes.STRING,
    fuelType: DataTypes.STRING,
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Vehicle;
};
