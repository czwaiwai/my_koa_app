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
const Order = OrderModel(sequelize);
const UserGameSettings = UserGameSettingsModel(sequelize);
const UserTree = UserTreeModel(sequelize);
const Game = GameModel(sequelize);
const EventResult = EventResultModel(sequelize);
const PayoutResult = PayoutResultModel(sequelize);
const Trade = TradeModel(sequelize);
const Transaction = TransactionModel(sequelize);

module.exports = {
  sequelize,
  User,
  Order,
  UserGameSettings,
  UserTree,
  Game,
  EventResult,
  PayoutResult,
  Trade,
  Transaction,
};
