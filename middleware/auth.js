const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret';

module.exports = async (ctx, next) => {
  const token = ctx.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'No token provided' };
    return;
  }
  try {
    ctx.state.user = jwt.verify(token, SECRET);
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
};

module.exports.SECRET = SECRET;
