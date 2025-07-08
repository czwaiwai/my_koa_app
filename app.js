const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./routes");
const { sequelize } = require("./models");

const app = new Koa();

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

// 数据库同步 alter: true 会自动修改表结构
sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

module.exports = app;
