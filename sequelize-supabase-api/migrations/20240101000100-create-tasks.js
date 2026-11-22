'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('todo', 'in_progress', 'done'), allowNull: false, defaultValue: 'todo' },
      due_date: { type: Sequelize.DATE },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
    await queryInterface.addIndex('tasks', ['user_id']);
    await queryInterface.addIndex('tasks', ['status']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('tasks');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tasks_status";');
  },
};
