module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    serviceRequestId: DataTypes.UUID,
    date: DataTypes.DATE,
    timeSlot: DataTypes.STRING,
    serviceType: DataTypes.STRING,
  });
  return Appointment;
};
