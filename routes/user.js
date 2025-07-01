const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { SECRET } = require('../middleware/auth');

const router = new Router();

// 注册
router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Username and password required' };
    return;
  }
  try {
    const user = await User.create({ username, password });
    ctx.body = { id: user.id, username: user.username };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: 'Username already exists' };
  }
});

// 登录
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
    return;
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  ctx.body = { token };
});

// 退出（前端只需删除本地token即可，这里提供一个接口用于兼容）
router.post('/logout', async (ctx) => {
  ctx.body = { message: 'Logout success (just remove token on client)' };
});

module.exports = router;
