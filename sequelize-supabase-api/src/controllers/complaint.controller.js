const service = require('../services/complaint.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const data = await service.create(req.user.id, req.body, req.files);
  res.status(201).json({
    success: true,
    message: 'Complaint raised successfully',
    data,
  });
});

exports.listMine = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMine(req.user.id, req.validatedQuery || req.query);
  res.json({ success: true, data: items, meta });
});

exports.listResolved = asyncHandler(async (req, res) => {
  const data = await service.listResolved(req.validatedQuery || req.query);
  res.json({ success: true, data });
});