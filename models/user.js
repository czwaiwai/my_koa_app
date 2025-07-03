const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: { // 剩余信用
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    usedCredit: { // 已使用信用
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    creditMax: { // 最大信用额度
      type: DataTypes.FLOAT,
      defaultValue: 1000.0,
    },
  });

  // 密码加密
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  // 关联UserGameSettings
  User.associate = (models) => {
    User.hasMany(models.UserGameSettings, {
      foreignKey: "userId",
      as: "gameSettings",
    });
  };

  return User;
};

const UserGameSettings = sequelize.define(
  "UserGameSettings",
  {
    game_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
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

// 关联User
UserGameSettings.associate = (models) => {
  UserGameSettings.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};
