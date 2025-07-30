module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("Inventory", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: DataTypes.UUID,
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    threshold: DataTypes.INTEGER,
  });
  return Inventory;
};
