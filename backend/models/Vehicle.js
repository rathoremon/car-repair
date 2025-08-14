"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, allowNull: false },

      photoUrl: DataTypes.STRING,
      make: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      carType: DataTypes.STRING,
      registrationNumber: { type: DataTypes.STRING, allowNull: false },
      vin: DataTypes.STRING,
      engineNumber: DataTypes.STRING,
      fuelType: { type: DataTypes.STRING, allowNull: false },

      ownerName: DataTypes.STRING,
      ownerMobile: DataTypes.STRING,
      ownerEmail: DataTypes.STRING,

      insuranceCompany: DataTypes.STRING,
      policyNumber: DataTypes.STRING,
      insuranceType: DataTypes.STRING,
      premiumAmount: DataTypes.INTEGER,
      insuranceStartDate: DataTypes.DATEONLY,
      insuranceExpiryDate: DataTypes.DATEONLY,
      insuranceContact: DataTypes.STRING,

      pucCertificateNo: DataTypes.STRING,
      pucValidityDate: DataTypes.DATEONLY,
      roadTaxCertificateNo: DataTypes.STRING,
      roadTaxValidityDate: DataTypes.DATEONLY,

      lastServiceDate: DataTypes.DATEONLY,
      lastServiceKM: DataTypes.INTEGER,
      nextServiceDueDate: DataTypes.DATEONLY,
      nextServiceDueKM: DataTypes.INTEGER,
      oilChangeDate: DataTypes.DATEONLY,
      oilChangeKM: DataTypes.INTEGER,
      batteryChangeDate: DataTypes.DATEONLY,
      tyreChangeDate: DataTypes.DATEONLY,
      brakeInspectionDate: DataTypes.DATEONLY,
      suspensionCheckDate: DataTypes.DATEONLY,
      wheelAlignmentDate: DataTypes.DATEONLY,
      transmissionOilChangeDate: DataTypes.DATEONLY,

      avgMonthlyKM: DataTypes.INTEGER,
      insuranceReminderDate: DataTypes.DATEONLY,
      pucReminderDate: DataTypes.DATEONLY,
      nextServiceReminderDate: DataTypes.DATEONLY,
    },
    {}
  );

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Vehicle;
};
