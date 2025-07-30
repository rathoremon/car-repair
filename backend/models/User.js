module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("customer", "provider", "mechanic", "admin"),
      allowNull: false,
      defaultValue: "customer",
    },
    isOtpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otpVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "rejected"),
      defaultValue: "pending",
    },
    onboardingComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Provider, { foreignKey: "userId" });
    User.hasOne(models.Mechanic, { foreignKey: "userId" });
    User.hasMany(models.Vehicle, { foreignKey: "userId" });
    User.hasMany(models.ServiceRequest, { foreignKey: "userId" });
    User.hasMany(models.BNPLRequest, { foreignKey: "userId" });
    User.hasOne(models.AdminUser, { foreignKey: "userId" });
  };

  return User;
};
