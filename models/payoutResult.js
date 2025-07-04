const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const PayoutResult = sequelize.define("PayoutResult", {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "订单ID",
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: "是否成功",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "赔付金额",
    },
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "错误信息",
    },
  });

  return PayoutResult;
};
