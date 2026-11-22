const Joi = require('joi');

const create = Joi.object({ name: Joi.string().max(100).required(), email: Joi.string().email().required() });
const update = Joi.object({ name: Joi.string().max(100), email: Joi.string().email() }).min(1);
const idParam = Joi.object({ id: Joi.string().uuid().required() });
const listQuery = Joi.object({ page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(100).default(10) });

module.exports = { create, update, idParam, listQuery };
