const AppError = require('../utils/AppError');

// validate(schema, 'body' | 'query' | 'params')
module.exports = (schema, source = 'body') => (req, _res, next) => {
  const { value, error } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new AppError('Validation failed', 422, error.details.map((d) => d.message)));
  }
  if (source === 'query') {
    // Express 5 / some setups expose req.query as a getter; keep parsed values separately too
    req.validatedQuery = value;
    Object.assign(req.query, value);
  } else {
    req[source] = value;
  }
  next();
};
