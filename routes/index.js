const Router = require('koa-router');
const userRoutes = require('./user');
const homeRoutes = require('./home');
const auth = require('../middleware/auth');

const router = new Router();
router.use('/user', auth, userRoutes.routes());
router.use(homeRoutes.routes());

module.exports = router;
