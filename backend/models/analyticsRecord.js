module.exports = (sequelize, DataTypes) => {
  const AnalyticsRecord = sequelize.define("AnalyticsRecord", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventType: DataTypes.STRING,
    source: DataTypes.STRING,
    payload: DataTypes.JSONB,
  });
  return AnalyticsRecord;
};
