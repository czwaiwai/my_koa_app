const Router = require("koa-router");
const userRoutes = require("./user");
const homeRoutes = require("./home");
const gameRoutes = require("./game");
const auth = require("../middleware/auth");

const router = new Router();
router.use("/user", auth, userRoutes.routes());
router.use("/game", auth, gameRoutes.routes());
router.use(homeRoutes.routes());

module.exports = router;
