const Joi = require('joi');

const status = Joi.string().valid('todo', 'in_progress', 'done');
const create = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().allow('', null),
  status,
  dueDate: Joi.date().iso().allow(null),
  userId: Joi.string().uuid().required(),
});
const update = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string().allow('', null),
  status,
  dueDate: Joi.date().iso().allow(null),
}).min(1);
const idParam = Joi.object({ id: Joi.string().uuid().required() });
const listQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status,
  userId: Joi.string().uuid(),
});

module.exports = { create, update, idParam, listQuery };
