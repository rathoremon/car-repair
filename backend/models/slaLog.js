module.exports = (sequelize, DataTypes) => {
  const SLALog = sequelize.define("SLALog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: DataTypes.UUID,
    assignmentId: DataTypes.UUID,
    status: DataTypes.STRING,
    timestamp: DataTypes.DATE,
  });
  return SLALog;
};
