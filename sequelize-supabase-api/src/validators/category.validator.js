const Joi = require('joi');

exports.create = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  code: Joi.string()
    .trim()
    .min(2)
    .max(30)
    .regex(/^[A-Za-z0-9_]+$/)
    .uppercase()
    .optional(),
  active: Joi.boolean().optional(),
}).unknown(true);

exports.update = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  code: Joi.string()
    .trim()
    .min(2)
    .max(30)
    .regex(/^[A-Za-z0-9_]+$/)
    .uppercase()
    .optional(),
  active: Joi.boolean().optional(),
})
  .min(1)
  .unknown(true);

exports.idParam = Joi.object({
  id: Joi.string().uuid().required(),
});

exports.listQuery = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(50),
}).unknown(true);
