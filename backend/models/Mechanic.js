// models/Mechanic.js
module.exports = (sequelize, DataTypes) => {
  const Mechanic = sequelize.define(
    "Mechanic",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, allowNull: false, unique: true },
      providerId: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      aadhar: { type: DataTypes.STRING, allowNull: true },
      photo: { type: DataTypes.STRING, allowNull: true },
      skillSet: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      experience: { type: DataTypes.INTEGER, allowNull: true },
      address: { type: DataTypes.JSONB, allowNull: true },
      availability: { type: DataTypes.JSONB, defaultValue: {} },
      status: {
        type: DataTypes.ENUM("active", "pending", "inactive", "suspended"),
        defaultValue: "pending",
      },
      lastLogin: { type: DataTypes.DATE, allowNull: true },
      attendance: { type: DataTypes.JSONB, defaultValue: [] },
      assignedJobs: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "Mechanics",
      paranoid: true,
    }
  );
  return Mechanic;
};
