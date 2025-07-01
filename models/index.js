const { Sequelize } = require('sequelize');
const UserModel = require('./user');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const User = UserModel(sequelize);

module.exports = {
  sequelize,
  User,
};
