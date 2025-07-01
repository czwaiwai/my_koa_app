const Router = require('koa-router');
const userRoutes = require('./user');

const router = new Router();

router.use('/user', userRoutes.routes());

module.exports = router;
