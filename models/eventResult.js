const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const EventResult = sequelize.define("EventResult", {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: "事件ID",
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "交易对符号",
    },
    outcome: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "事件结果",
    },
    settled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "是否已结算",
    },
  });

  return EventResult;
};
