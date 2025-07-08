const { Sequelize } = require("sequelize");
const UserModel = require("./user");
const OrderModel = require("./order");
const UserGameSettingsModel = require("./userGameSettings");
const UserTreeModel = require("./userTree");
const GameModel = require("./game");
const EventResultModel = require("./eventResult");
const PayoutResultModel = require("./payoutResult");
const TradeModel = require("./trade");
const TransactionModel = require("./transaction");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const User = UserModel(sequelize);
const UserGameSettings = UserGameSettingsModel(sequelize);
// const Order = OrderModel(sequelize);
// const UserTree = UserTreeModel(sequelize);
// const Game = GameModel(sequelize);
// const EventResult = EventResultModel(sequelize);
// const PayoutResult = PayoutResultModel(sequelize);
// const Trade = TradeModel(sequelize);
// const Transaction = TransactionModel(sequelize);

// 统一建立关联
const models = { User, UserGameSettings };
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
