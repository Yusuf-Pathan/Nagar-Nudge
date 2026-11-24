'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('complaints', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(150), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      category: { type: Sequelize.STRING(30), allowNull: false },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'Pending',
      },
      latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: false },
      longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: true },
      media: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: Sequelize.literal("'[]'::jsonb"),
      },
      resolved_at: { type: Sequelize.DATE, allowNull: true },
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

    // Speeds up "my complaints" and "resolved complaints" queries
    await queryInterface.addIndex('complaints', ['user_id', 'created_at']);
    await queryInterface.addIndex('complaints', ['status', 'resolved_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('complaints');
  },
};
