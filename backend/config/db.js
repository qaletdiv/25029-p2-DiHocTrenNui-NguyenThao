const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Automatically ensure .env is loaded from standard locations
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// 1. Configure TLS / SSL settings for TiDB
function getSslConfig() {
  const sslEnv = process.env.DB_SSL || process.env.TIDB_ENABLE_SSL;
  const dbHost = process.env.DB_HOST || '';
  const isTidbCloud = dbHost.toLowerCase().includes('tidbcloud.com');

  // Explicitly disabled
  if (sslEnv === 'false' || sslEnv === '0') {
    return false;
  }

  // Explicitly enabled, running against TiDB Cloud, or custom CA provided
  if (
    sslEnv === 'true' ||
    sslEnv === '1' ||
    isTidbCloud ||
    process.env.DB_CA ||
    process.env.DB_SSL_CA ||
    process.env.TIDB_SSL_CA
  ) {
    const sslConfig = {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };

    const caPath = process.env.DB_CA || process.env.DB_SSL_CA || process.env.TIDB_SSL_CA;
    if (caPath && fs.existsSync(caPath)) {
      sslConfig.ca = fs.readFileSync(caPath, 'utf8');
    }

    return sslConfig;
  }

  return false;
}

// 2. Create the shared connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 4000,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_SCHEMA || 'dhtn',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  ssl: getSslConfig(),
  decimalNumbers: true, // Return DECIMAL columns as JS numbers matching mock contracts
  dateStrings: ['DATE'], // Keep DATE columns formatted as 'YYYY-MM-DD' strings
  typeCast: function (field, next) {
    // Cast TINYINT(1) boolean flags (e.g. is_active) to native JS booleans
    if (field.type === 'TINY' && field.length === 1) {
      const val = field.string();
      return val === null ? null : val === '1';
    }
    return next();
  },
});

/**
 * Execute a query with parameters using the shared pool.
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<[Array, Object]>}
 */
async function query(sql, params = []) {
  return pool.query(sql, params);
}

/**
 * Execute a prepared statement with parameters using the shared pool.
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<[Array, Object]>}
 */
async function execute(sql, params = []) {
  return pool.execute(sql, params);
}

/**
 * Obtain a dedicated connection from the pool (for transactions).
 * Remember to call connection.release() when done.
 * @returns {Promise<mysql.PoolConnection>}
 */
async function getConnection() {
  return pool.getConnection();
}

/**
 * Verify connectivity to TiDB.
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS connected');
    return rows && rows.length > 0 && rows[0].connected === 1;
  } catch (error) {
    console.error('[TiDB Error] Connection test failed:', error.message);
    throw error;
  }
}

/**
 * Gracefully close the connection pool.
 */
async function closePool() {
  try {
    await pool.end();
    console.log('[TiDB] Connection pool closed gracefully.');
  } catch (error) {
    console.error('[TiDB Error] Error closing connection pool:', error.message);
  }
}

// Register process exit listeners for graceful pool shutdown
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  query,
  execute,
  getConnection,
  testConnection,
  closePool,
  getSslConfig,
};
