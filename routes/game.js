const Router = require("koa-router");

const { Game } = require("../models");
const { pluralize } = require("sequelize/lib/utils");

const router = new Router();

// 创建游戏
router.post("/create", async (ctx) => {
  const { status, drawNo, gameStartTime, gameEndTime } = ctx.request.body;
  const game = await Game.create({
    status,
    drawNo,
    gameStartTime,
    gameEndTime,
  });
  ctx.body = { success: true, game };
});
// 游戏列表
router.post("/list", async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.request.body;
  const games = await Game.findAndCountAll({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [["createdAt", "DESC"]],
  });
  ctx.body = { success: true, games };
});
// 获取游戏结果
router.post("/result", async (ctx) => {
  const { drawNo } = ctx.request.body;
  if (!drawNo) {
    ctx.status = 400;
    ctx.body = { error: "drawNo required" };
    return;
  }
  const game = await Game.update(
    { ...ctx.request.body, status: "1" },
    {
      where: { drawNo: drawNo },
      returning: true, // 返回更新后的数据
      plain: true, // 返回单个对象而不是数组
      // attributes: ["openTime", "qian", "bai", "shi", "ge", "ball5"],
      fields: ["status", "openTime", "qian", "bai", "shi", "ge", "ball5"],
    }
  );
  ctx.body = { success: true, game };
});

module.exports = router;
