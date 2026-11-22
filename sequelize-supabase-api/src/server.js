const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Supabase PostgreSQL');
    const server = app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api/v1`));

    const shutdown = async (signal) => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };
    ['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
  } catch (err) {
    console.error('Unable to start server:', err.message);
    process.exit(1);
  }
})();
