module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define("Provider", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    companyName: DataTypes.STRING,
    tier: DataTypes.STRING,
    serviceArea: DataTypes.ARRAY(DataTypes.STRING),
    location: DataTypes.JSONB,
    availability: DataTypes.JSONB,
    workingHours: DataTypes.JSONB,
    garageImages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    serviceCategories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    kycStatus: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },
    // 🆕 Bank Fields
    accountHolderName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    ifscCode: DataTypes.STRING,
    bankName: DataTypes.STRING,
    branchName: DataTypes.STRING,
    upiId: DataTypes.STRING,
  });

  Provider.associate = (models) => {
    Provider.belongsTo(models.User, { foreignKey: "userId" });
    Provider.hasMany(models.Mechanic, { foreignKey: "providerId" });
    Provider.hasMany(models.ServiceRequest, { foreignKey: "providerId" });
    Provider.hasMany(models.Document, { foreignKey: "providerId" });
  };

  return Provider;
};
