const { DataTypes } = require("sequelize");
const _ = require("lodash");
const GameType = _.range(1, 10);
module.exports = (sequelize) => {
  const UserGameSettings = sequelize.define(
    "UserGameSettings",
    {
      gameType: {
        type: DataTypes.ENUM(GameType),
        allowNull: false,
        comment: "游戏类型",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "分类",
      },
      minBet: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "最小投注额",
      },
      oddsLimit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "赔率上限",
      },
      singleBetLimit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "单注限额",
      },
      singleItemLimit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "单项限额",
      },
      rebate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: "返利",
      },
      odds: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "赔率",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "gameType"],
        },
      ],
    }
  );

  UserGameSettings.associate = (models) => {
    UserGameSettings.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return UserGameSettings;
};
