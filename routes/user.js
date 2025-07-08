const Router = require("koa-router");
const { sequelize, User, UserGameSettings } = require("../models");
const transaction = require("../models/transaction");

const router = new Router();

// 获取用户信息（需要token验证）
router.get("/profile", async (ctx) => {
  const user = await User.findByPk(ctx.state.user.id, {
    attributes: ["id", "username", "createdAt", "updatedAt"],
    include: [{ model: UserGameSettings, as: "gameSettings" }],
  });
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };
    return;
  }
  ctx.body = { success: true, user };
});

router.post("/profileUpdate", async (ctx) => {});

// 一次性添加多条userGameSettings数据
router.post("/userGameSettings/bulk", async (ctx) => {
  const { userId, settings } = ctx.request.body;
  if (!userId || !Array.isArray(settings) || settings.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "userId and non-empty settings array required" };
    return;
  }
  try {
    await sequelize.transaction(async (t) => {
      await UserGameSettings.destroy({
        where: { userId },
        transaction: t,
      });
      // 给每条设置添加userId字段
      const dataToCreate = settings.map((item) => ({ ...item, userId }));
      const created = await UserGameSettings.bulkCreate(dataToCreate, {
        validate: true,
        transaction: t,
      });
      ctx.body = { success: true, createdCount: created.length };
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message || "Failed to create user game settings" };
  }
});
// 获取本人的设置
router.get("/userGameSettinags", async (ctx) => {
  const userId = ctx.state.user.id;
  const settings = await UserGameSettings.findAll({
    where: { userId },
    attributes: ["gameType", "settings"],
  });
  ctx.body = { success: true, settings };
});

// 退出（前端只需删除本地token即可，这里提供一个接口用于兼容）
router.post("/logout", async (ctx) => {
  ctx.body = {
    success: true,
    message: "Logout success (just remove token on client)",
  };
});

module.exports = router;
