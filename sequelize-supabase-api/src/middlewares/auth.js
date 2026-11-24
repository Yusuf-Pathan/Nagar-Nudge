const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const AppError = require('../utils/AppError');

module.exports = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Authentication required', 401);
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(payload.id, { attributes: ['id', 'name', 'email', 'phone'] });

    if (!user) {
      throw new AppError('Authentication required', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError('Invalid or expired token', 401));
  }
};
