module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define("Dispute", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    serviceRequestId: DataTypes.UUID,
    reason: DataTypes.TEXT,
    status: DataTypes.STRING,
  });
  return Dispute;
};
