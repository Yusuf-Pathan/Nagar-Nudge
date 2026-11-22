const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
