const router = require('express').Router();
const { sequelize } = require('../models');

router.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ success: false, status: 'error', database: 'disconnected' });
  }
});

router.use('/auth', require('./auth.routes'));
router.use('/complaints', require('./complaint.routes'));
router.use('/users', require('./user.routes'));
router.use('/tasks', require('./task.routes'));

module.exports = router;
