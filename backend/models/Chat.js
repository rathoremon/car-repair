module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: DataTypes.UUID,
    receiverId: DataTypes.UUID,
    assignmentId: DataTypes.UUID,
    message: DataTypes.TEXT,
    messageType: DataTypes.STRING,
  });
  return Chat;
};
