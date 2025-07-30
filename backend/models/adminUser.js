module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define("AdminUser", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    adminLevel: DataTypes.STRING,
  });

  AdminUser.associate = (models) => {
    AdminUser.belongsTo(models.User, { foreignKey: "userId" });
  };

  return AdminUser;
};
