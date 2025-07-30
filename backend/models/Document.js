module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define("Document", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["application/pdf", "image/jpeg", "image/png"]],
      },
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { max: 5 * 1024 * 1024 },
    },
    checksum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("license", "gst", "id_proof", "garage_image"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "under_review", "approved", "rejected"),
      defaultValue: "pending",
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, { foreignKey: "userId" });
    Document.belongsTo(models.Provider, { foreignKey: "providerId" });
  };

  return Document;
};
