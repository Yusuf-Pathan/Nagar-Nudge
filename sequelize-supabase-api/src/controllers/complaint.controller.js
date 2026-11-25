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

exports.listAll = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAll(req.validatedQuery || req.query);
  res.json({ success: true, data: items, meta });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.getById(req.params.id) });
});

exports.assign = asyncHandler(async (req, res) => {
  const data = await service.assign(req.params.id, req.body.assigneeId);
  res.json({
    success: true,
    message: data.assignee ? 'Complaint assigned successfully' : 'Complaint unassigned',
    data,
  });
});

exports.dashboard = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await service.getDashboard() });
});

exports.assignableUsers = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await service.getAssignableUsers() });
});
