module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define("AuditLog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adminId: DataTypes.UUID,
    action: DataTypes.STRING,
    target: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  });
  return AuditLog;
};
