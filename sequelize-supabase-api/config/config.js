// Used by sequelize-cli (migrations / seeders)
require('dotenv').config();

const base = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions:
    process.env.DB_SSL === 'false' ? {} : { ssl: { require: true, rejectUnauthorized: false } },
};

module.exports = { development: base, test: base, production: base };
