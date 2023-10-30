module.exports = function (sequelize, DataTypes) {
  const idlist = sequelize.define("Idlist", {
    userID: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userPW: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    usermail: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  });
  return idlist;
};
