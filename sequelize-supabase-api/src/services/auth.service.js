const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { normalizeIdentifier } = require('../utils/identifier');

const buildAuthResponse = (user) => ({
  accessToken: jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn }),
  user: user.toJSON(), // password is removed by the model's toJSON
});

exports.register = async ({ name, email, mobile, password }) => {
  const normalizedEmail = email ? email.trim().toLowerCase() : null;

  let normalizedPhone = null;
  if (mobile) {
    const parsed = normalizeIdentifier(mobile);
    if (!parsed || parsed.type !== 'phone') {
      throw new AppError('Enter a valid 10-digit mobile number', 400);
    }
    normalizedPhone = parsed.value;
  }

  const conditions = [];
  if (normalizedEmail) conditions.push({ email: normalizedEmail });
  if (normalizedPhone) conditions.push({ phone: normalizedPhone });

  const existing = await User.findOne({ where: { [Op.or]: conditions } });
  if (existing) {
    throw new AppError('An account with this email or mobile number already exists', 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: await bcrypt.hash(password, 10),
  });

  return buildAuthResponse(user);
};

exports.login = async ({ identifier, password }) => {
  const parsed = normalizeIdentifier(identifier);
  if (!parsed) {
    throw new AppError('Enter a valid email or 10-digit mobile number', 400);
  }

  const where = parsed.type === 'email' ? { email: parsed.value } : { phone: parsed.value };
  const user = await User.findOne({ where });

  // Same message whether the account is missing or the password is wrong
  const invalid = new AppError('Invalid email/mobile number or password', 401);
  if (!user || !user.password) throw invalid;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw invalid;

  return buildAuthResponse(user);
};

// Stateless JWT: the client discards the token on logout.
// Token is validated by auth middleware before this runs.
exports.logout = async (user) => ({
  userId: user.id,
  loggedOutAt: new Date().toISOString(),
});
