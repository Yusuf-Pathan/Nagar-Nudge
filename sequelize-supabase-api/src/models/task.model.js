const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT },
      status: { type: DataTypes.ENUM('todo', 'in_progress', 'done'), allowNull: false, defaultValue: 'todo' },
      dueDate: { type: DataTypes.DATE },
      userId: { type: DataTypes.UUID, allowNull: false },
    },
    { tableName: 'tasks' }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Task;
};
