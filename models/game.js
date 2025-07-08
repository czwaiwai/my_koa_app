const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Game = sequelize.define("Game", {
    drawNo: {
      // 游戏序列号
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "游戏期号",
    },
    status: {
      // 游戏状态
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
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
    openTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "开奖时间",
    },
    qian: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "仟",
    },
    bai: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "佰",
    },
    shi: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "拾",
    },
    ge: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "个",
    },
    ball5: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "球5",
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
