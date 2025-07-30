module.exports = (sequelize, DataTypes) => {
  const CrossSellAd = sequelize.define("CrossSellAd", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    link: DataTypes.STRING,
    impressions: DataTypes.INTEGER,
    clicks: DataTypes.INTEGER,
  });
  return CrossSellAd;
};
