require('dotenv').config(); // para leer .env
const sql = require('mssql/msnodesqlv8');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  driver: process.env.DB_DRIVER,
  options: {
    trustedConnection: process.env.DB_TRUSTED_CONNECTION === 'true'
  }
};

async function conectarDB() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
}

module.exports = { sql, conectarDB };

