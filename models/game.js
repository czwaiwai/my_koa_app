const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Game = sequelize.define("Game", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seriaNum: {
      // 游戏序列号
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      // 游戏状态
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    statusTxt: {
      // 游戏状态文本
      type: DataTypes.STRING,
      allowNull: true,
    },
    gameStartTime: {
      // 游戏开始时间
      type: DataTypes.DATE,
      allowNull: true,
    },
    gameEndTime: {
      // 游戏结束时间
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Game.associate = (models) => {
    Game.hasMany(models.Order, {
      foreignKey: "gameId",
      as: "orders",
    });
  };
  return Game;
};
