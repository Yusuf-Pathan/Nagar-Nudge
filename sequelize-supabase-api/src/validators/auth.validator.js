const Joi = require('joi');

exports.register = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().trim().email().max(150).optional(),
  phone: Joi.string().trim().max(20).optional(),
  password: Joi.string().min(6).max(72).required(), // 72 is bcrypt's limit
})
  .or('email', 'phone') // at least one of them is required
  .unknown(true);       // ignore extra fields such as confirmPassword

exports.login = Joi.object({
  identifier: Joi.string().trim().required(), // email or mobile number
  password: Joi.string().required(),
}).unknown(true);
