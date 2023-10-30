module.exports = function (Sequelize, DataTypes) {
  const banner = Sequelize.define("Banner", {
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  });
  return banner;
};
