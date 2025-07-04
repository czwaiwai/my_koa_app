const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
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
    console.log(err)
    ctx.status = 400;
    ctx.body = { error: "Username already exists" };
  }
});

// 登录
router.post("/login", async (ctx) => {
  const { userName, username, password } = ctx.request.body;
  const user = await User.findOne({
    where: { username: userName || username },
  });
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
  // refreshToken 有效期更长
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
  // 设置 httpOnly cookie
  ctx.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // 生产环境建议为 true（仅 https）
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    sameSite: "lax",
  });
  ctx.body = {
    success: true,
    token,
    longToken: refreshToken,
    accessToken: token,
    ...{
      id: user.id,
      userName: user.username,
      nickName: user.nickname,
      balance: user.balance,
      usedCredit: user.usedCredit,
      creditMax: user.creditMax,
    },
  };
});

// 刷新token
router.post("/refreshToken", async (ctx) => {
  // 从 cookie 读取 refreshToken
  const refreshToken = ctx.cookies.get("refreshToken");
  if (!refreshToken) {
    ctx.status = 400;
    ctx.body = { error: "refreshToken required" };
    return;
  }
  try {
    const payload = jwt.verify(refreshToken, SECRET);
    // 重新生成新的token
    const token = jwt.sign(
      { id: payload.id, username: payload.username },
      SECRET,
      {
        expiresIn: "1h",
      }
    );
    ctx.body = { success: true, token };
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid or expired refreshToken" };
  }
});

// 退出（前端只需删除本地token即可，这里提供一个接口用于兼容）
router.post("/logout", async (ctx) => {
  // 清除 refreshToken cookie
  ctx.cookies.set("refreshToken", null, {
    httpOnly: true,
    secure: false, // 生产环境建议为 true
    maxAge: 0,
    sameSite: "lax",
  });
  ctx.body = {
    success: true,
    message: "Logout success (refreshToken cookie cleared)",
  };
});

module.exports = router;
