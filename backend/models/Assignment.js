module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define("Assignment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    mechanicId: DataTypes.UUID,
    serviceRequestId: DataTypes.UUID,
    status: DataTypes.STRING,
  });
  return Assignment;
};
