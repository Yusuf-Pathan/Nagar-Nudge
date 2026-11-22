const service = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { items, meta } = await service.list(req.validatedQuery || req.query);
  res.json({ success: true, data: items, meta });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.getById(req.params.id) });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

exports.update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.update(req.params.id, req.body) });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();
});
