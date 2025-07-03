module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    txId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "交易ID",
    },
    fromAccountId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "转出账户ID",
    },
    toAccountId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "转入账户ID",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "金额",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "交易类型",
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "关联ID（如订单ID）",
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Date.now(),
      comment: "时间戳",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PENDING",
      comment: "状态（PENDING, SUCCESS, FAILURE）",
    },
  });

  return Transaction;
};
