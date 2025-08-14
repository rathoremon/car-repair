// models/RequestTimeline.js
/**
 * Timeline/audit log for a service request lifecycle.
 * Kept simple and consistent with your model style.
 */
module.exports = (sequelize, DataTypes) => {
  const RequestTimeline = sequelize.define(
    "RequestTimeline",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requestId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      byRole: {
        type: DataTypes.ENUM("customer", "provider", "mechanic", "admin"),
        allowNull: false,
      },
      byId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      event: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "RequestTimelines",
    }
  );

  return RequestTimeline;
};
