const Joi = require('joi');
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } = require('../constants/complaint.constants');

exports.create = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().max(2000).allow('').optional(),
  category: Joi.string().trim().max(30).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().trim().max(255).allow('').optional(),
}).unknown(true);

exports.myComplaintsQuery = Joi.object({
  status: Joi.string().valid(...COMPLAINT_STATUSES).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
}).unknown(true);

exports.resolvedQuery = Joi.object({
  limit: Joi.number().integer().min(1).max(20).default(3),
  category: Joi.string().valid(...COMPLAINT_CATEGORIES),
});

exports.listAllQuery = Joi.object({
  status: Joi.string().valid(...COMPLAINT_STATUSES).optional(),
  category: Joi.string().trim().max(30).optional(),
  search: Joi.string().trim().max(100).optional(),
  assigned: Joi.string().valid('true', 'false').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
}).unknown(true);

exports.assign = Joi.object({
  assigneeId: Joi.string().uuid().allow(null).required(),
}).unknown(true);

exports.idParam = Joi.object({
  id: Joi.string().uuid().required(),
});
