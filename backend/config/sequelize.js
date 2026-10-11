const { Sequelize, DataTypes, Op } = require('sequelize');
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

/**
 * Configure TLS / SSL settings for TiDB
 */
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

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 4000;
const DB_USERNAME = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_SCHEMA = process.env.DB_SCHEMA || 'dhtn';

const sequelize = new Sequelize(DB_SCHEMA, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions: {
    ssl: getSslConfig(),
    decimalNumbers: true, // Cast DECIMAL to JS numbers
    dateStrings: ['DATE'], // Keep DATE as YYYY-MM-DD strings
    typeCast: function (field, next) {
      if (field.type === 'TINY' && field.length === 1) {
        const val = field.string();
        return val === null ? null : val === '1';
      }
      return next();
    },
  },
  pool: {
    max: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

/**
 * Test connectivity to TiDB
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('[TiDB Sequelize] Connection failed:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  Op,
  testConnection,
};
