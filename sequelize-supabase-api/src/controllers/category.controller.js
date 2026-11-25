const service = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { items, meta } = await service.list(req.validatedQuery || req.query);
  res.json({ success: true, data: items, meta });
});

exports.create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, message: 'Category created', data });
});

exports.update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  res.json({ success: true, message: 'Category updated', data });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();
});
