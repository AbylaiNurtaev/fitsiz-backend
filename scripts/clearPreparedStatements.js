require('dotenv').config();
const { Client } = require('pg');

async function clearPreparedStatements() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    await client.query('DEALLOCATE ALL');
    console.log('✅ Cleared all prepared statements');
    
  } catch (error) {
    console.error('❌ Error clearing prepared statements:', error.message);
  } finally {
    await client.end();
  }
}

// Запускаем очистку
clearPreparedStatements();
