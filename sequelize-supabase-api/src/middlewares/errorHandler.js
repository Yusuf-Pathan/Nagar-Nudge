const env = require('../config/env');
const AppError = require('../utils/AppError');

const notFound = (req, _res, next) => next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500;
  let message = err.message;
  let details = err.details;

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Resource already exists';
    details = err.errors.map((e) => e.message);
  } else if (err.name === 'SequelizeValidationError') {
    status = 422;
    details = err.errors.map((e) => e.message);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Invalid reference to a related resource';
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status >= 500 && env.nodeEnv === 'production' ? 'Internal server error' : message,
    ...(details && { details }),
  });
};

module.exports = { notFound, errorHandler };
