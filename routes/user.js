const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, UserGameSettings } = require("../models");
const { SECRET } = require("../middleware/auth");

const router = new Router();

// 注册
router.post("/register", async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: "Username and password required" };
    return;
  }
  try {
    const user = await User.create({ username, password });
    ctx.body = { success: true, id: user.id, username: user.username };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: "Username already exists" };
  }
});

// 登录
router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: "Invalid username or password" };
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ctx.status = 401;
    ctx.body = { error: "Invalid username or password" };
    return;
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });
  ctx.body = { success: true, token };
});

// 退出（前端只需删除本地token即可，这里提供一个接口用于兼容）
router.post("/logout", async (ctx) => {
  ctx.body = { message: "Logout success (just remove token on client)" };
});

// 获取用户信息（需要token验证）
router.get("/profile", async (ctx) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header missing or malformed" };
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "username", "createdAt", "updatedAt"], // 返回需要的字段
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return;
    }
    ctx.body = { success: true, user };
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid or expired token" };
  }
});

// 一次性添加多条userGameSettings数据
router.post("/userGameSettings/bulk", async (ctx) => {
  const { userId, settings } = ctx.request.body;
  if (!userId || !Array.isArray(settings) || settings.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "userId and non-empty settings array required" };
    return;
  }
  try {
    // 给每条设置添加userId字段
    const dataToCreate = settings.map((item) => ({ ...item, userId }));
    const created = await UserGameSettings.bulkCreate(dataToCreate, {
      validate: true,
    });
    ctx.body = { success: true, createdCount: created.length };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message || "Failed to create user game settings" };
  }
});

module.exports = router;
