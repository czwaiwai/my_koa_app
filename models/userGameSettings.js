const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserGameSettings = sequelize.define(
    "UserGameSettings",
    {
      game_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      min_bet: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      odds_limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      single_bet_limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rebate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      odds: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "game_type"],
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
