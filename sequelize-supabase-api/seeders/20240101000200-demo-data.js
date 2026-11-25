'use strict';
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const userId = randomUUID();
    const now = new Date();
    const password = await bcrypt.hash('secret123', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: userId,
        name: 'Demo User',
        email: 'demo@example.com',
        phone: null,
        password,
        created_at: now,
        updated_at: now,
      },
    ]);
    await queryInterface.bulkInsert('tasks', [
      { id: randomUUID(), title: 'Set up Angular 16 client', status: 'in_progress', user_id: userId, created_at: now, updated_at: now },
      { id: randomUUID(), title: 'Connect to Supabase', status: 'done', user_id: userId, created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
