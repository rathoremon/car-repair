module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  return Notification;
};
