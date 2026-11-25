'use strict';

const DEFAULT_CATEGORIES = [
  { name: 'Roads', code: 'ROADS' },
  { name: 'Streetlights', code: 'STREETLIGHTS' },
  { name: 'Garbage', code: 'GARBAGE' },
  { name: 'Water Supply', code: 'WATER' },
  { name: 'Drainage', code: 'DRAINAGE' },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'categories',
      DEFAULT_CATEGORIES.map((c) => ({ ...c, active: true, created_at: now, updated_at: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
