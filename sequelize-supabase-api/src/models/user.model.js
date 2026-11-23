const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: true, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING(10), allowNull: true, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
    },
    { tableName: 'users' }
  );

  // Never send the password hash back in any response
  User.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
  };

  return User;
};