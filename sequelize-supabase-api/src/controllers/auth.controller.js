const service = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const data = await service.register(req.body);
  res.status(201).json({ success: true, message: 'Account created successfully', data });
});

exports.login = asyncHandler(async (req, res) => {
  const data = await service.login(req.body);
  res.json({ success: true, message: 'Login successful', data });
});

exports.logout = asyncHandler(async (req, res) => {
  const data = await service.logout(req.user);
  res.json({ success: true, message: 'Logged out successfully', data });
});
