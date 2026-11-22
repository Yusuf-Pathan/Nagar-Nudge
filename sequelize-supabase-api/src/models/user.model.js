const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    },
    { tableName: 'users' }
  );

  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
  };
  return User;
};
