require('dotenv').config();
const { Client } = require('pg');

// Middleware для очистки prepared statements
async function clearPreparedStatementsMiddleware(req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      await client.query('DEALLOCATE ALL');
      await client.end();
    } catch (error) {
      // Игнорируем ошибки очистки
    }
  }
  next();
}

module.exports = clearPreparedStatementsMiddleware;
