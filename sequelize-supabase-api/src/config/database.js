const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' ? console.log : false,
  dialectOptions: env.dbSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: { underscored: true, timestamps: true },
});

module.exports = sequelize;
