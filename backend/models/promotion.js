// models/promotion.js

module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define(
    "Promotion",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("image", "promotion"),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for image, required for promotion (enforced in controller)
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      redirectUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctaText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctaUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },
    },
    {
      tableName: "Promotion",
      timestamps: true,
      underscored: true,
    }
  );

  return Promotion;
};
