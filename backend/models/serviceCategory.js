module.exports = (sequelize, DataTypes) => {
  const ServiceCategory = sequelize.define(
    "ServiceCategory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { len: [3, 100] },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [10, 200] },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      isEmergencyService: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      defaultDuration: {
        type: DataTypes.INTEGER,
        validate: { min: 5, max: 180 },
      },
      pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );

  return ServiceCategory;
};
