'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(50), allowNull: false },
      code: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()'),
      },
    });

    await queryInterface.addIndex('categories', ['code'], { unique: true, name: 'categories_code_unique' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
