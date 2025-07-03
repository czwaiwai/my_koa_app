module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "账户ID",
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户ID",
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "可用余额",
    },
    frozen: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "冻结金额",
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "乐观锁版本号",
    },
  });

  return Account;
};
