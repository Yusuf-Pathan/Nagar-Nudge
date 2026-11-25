'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('complaints', 'assigned_to', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('complaints', 'assigned_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addIndex('complaints', ['assigned_to']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('complaints', ['assigned_to']);
    await queryInterface.removeColumn('complaints', 'assigned_at');
    await queryInterface.removeColumn('complaints', 'assigned_to');
  },
};
