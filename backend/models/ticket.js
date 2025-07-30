module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define("Ticket", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    subject: DataTypes.STRING,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
  });
  return Ticket;
};
