const sequelize = require('../config/database');

const models = {
  User: require('./user.model')(sequelize),
  Task: require('./task.model')(sequelize),
};

Object.values(models).forEach((m) => m.associate && m.associate(models));

module.exports = { sequelize, ...models };
