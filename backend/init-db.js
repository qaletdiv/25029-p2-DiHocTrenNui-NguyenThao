/**
 * Automated Database Initialization Script for TiDB / MySQL
 *
 * Tasks:
 * - Load mock data from JavaScript files in backend/data.
 * - Connect to TiDB using TLS when configured.
 * - Create the database if it does not already exist.
 * - Create tables if they do not already exist.
 * - Read mock data from JavaScript arrays.
 * - Insert data in batches to reduce server requests.
 * - Upsert existing records based on primary key (ON DUPLICATE KEY UPDATE) to avoid duplicates.
 * - Display the number of records processed and close database connection on completion.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// 1. Load environment variables
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '.env')
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// 2. Resolve data directory
const dataDir = fs.existsSync(path.resolve(__dirname, 'data'))
  ? path.resolve(__dirname, 'data')
  : path.resolve(__dirname, 'backend', 'data');

// 3. Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 4000;
const DB_USERNAME = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_SCHEMA = process.env.DB_SCHEMA || 'dhtn';
const BATCH_SIZE = parseInt(process.env.DB_BATCH_SIZE, 10) || 50;

/**
 * Configure TLS / SSL settings for TiDB
 */
function getSslConfig() {
  const sslEnv = process.env.DB_SSL || process.env.TIDB_ENABLE_SSL;
  const isTidbCloud = DB_HOST.toLowerCase().includes('tidbcloud.com');

  // Explicitly disabled
  if (sslEnv === 'false' || sslEnv === '0') {
    return false;
  }

  // Explicitly enabled, or running against TiDB Cloud, or custom CA provided
  if (sslEnv === 'true' || sslEnv === '1' || isTidbCloud || process.env.DB_CA || process.env.DB_SSL_CA || process.env.TIDB_SSL_CA) {
    const sslConfig = {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    };

    const caPath = process.env.DB_CA || process.env.DB_SSL_CA || process.env.TIDB_SSL_CA;
    if (caPath && fs.existsSync(caPath)) {
      sslConfig.ca = fs.readFileSync(caPath, 'utf8');
    }

    return sslConfig;
  }

  return false;
}

/**
 * Table Schema Definitions
 */
const TABLE_SCHEMAS = [
  {
    table: 'roles',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`roles\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'actions',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`actions\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'resources',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`resources\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'permissions',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`permissions\` (
        \`id\` INT PRIMARY KEY,
        \`resource_id\` INT NOT NULL,
        \`action_id\` INT NOT NULL,
        \`code\` VARCHAR(100) NOT NULL UNIQUE,
        KEY \`idx_resource_id\` (\`resource_id\`),
        KEY \`idx_action_id\` (\`action_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'role_permissions',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`role_permissions\` (
        \`id\` INT PRIMARY KEY,
        \`role_id\` INT NOT NULL,
        \`permission_id\` INT NOT NULL,
        KEY \`idx_role_id\` (\`role_id\`),
        KEY \`idx_permission_id\` (\`permission_id\`),
        UNIQUE KEY \`uniq_role_permission\` (\`role_id\`, \`permission_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'student_statuses',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`student_statuses\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'bank_transaction_statuses',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`bank_transaction_statuses\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'disbursement_statuses',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`disbursement_statuses\` (
        \`id\` INT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'accounts',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`accounts\` (
        \`id\` INT PRIMARY KEY,
        \`username\` VARCHAR(100) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`role_id\` INT NOT NULL,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        KEY \`idx_role_id\` (\`role_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'schools',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`schools\` (
        \`id\` INT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50),
        \`email\` VARCHAR(255),
        \`address\` TEXT,
        \`note\` TEXT,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_by\` INT,
        \`updated_by\` INT,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'teachers',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`teachers\` (
        \`id\` INT PRIMARY KEY,
        \`account_id\` INT,
        \`school_id\` INT,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50),
        \`gender\` VARCHAR(20),
        \`address\` TEXT,
        \`note\` TEXT,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_by\` INT,
        \`updated_by\` INT,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_account_id\` (\`account_id\`),
        KEY \`idx_school_id\` (\`school_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'volunteers',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`volunteers\` (
        \`id\` INT PRIMARY KEY,
        \`account_id\` INT,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50),
        \`gender\` VARCHAR(20),
        \`address\` TEXT,
        \`note\` TEXT,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_by\` INT,
        \`updated_by\` INT,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_account_id\` (\`account_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'sponsors',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`sponsors\` (
        \`id\` INT PRIMARY KEY,
        \`account_id\` INT,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50),
        \`gender\` VARCHAR(20),
        \`address\` TEXT,
        \`note\` TEXT,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_by\` INT,
        \`updated_by\` INT,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_account_id\` (\`account_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'students',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`students\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`date_of_birth\` DATE,
        \`gender\` VARCHAR(20),
        \`phone\` VARCHAR(50),
        \`address\` TEXT,
        \`school_id\` INT,
        \`grade\` VARCHAR(50),
        \`family_condition\` TEXT,
        \`status_id\` INT,
        \`monthly_amount\` DECIMAL(15, 2) DEFAULT 0,
        \`avatar_url\` VARCHAR(500),
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_by\` INT,
        \`updated_by\` INT,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_school_id\` (\`school_id\`),
        KEY \`idx_status_id\` (\`status_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'teacher_students',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`teacher_students\` (
        \`id\` INT PRIMARY KEY,
        \`student_id\` VARCHAR(50) NOT NULL,
        \`teacher_id\` INT NOT NULL,
        \`start_date\` DATETIME,
        \`end_date\` DATETIME,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_student_id\` (\`student_id\`),
        KEY \`idx_teacher_id\` (\`teacher_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'volunteer_students',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`volunteer_students\` (
        \`id\` INT PRIMARY KEY,
        \`student_id\` VARCHAR(50) NOT NULL,
        \`volunteer_id\` INT NOT NULL,
        \`start_date\` DATETIME,
        \`end_date\` DATETIME,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_student_id\` (\`student_id\`),
        KEY \`idx_volunteer_id\` (\`volunteer_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'sponsor_students',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`sponsor_students\` (
        \`id\` INT PRIMARY KEY,
        \`student_id\` VARCHAR(50) NOT NULL,
        \`sponsor_id\` INT NOT NULL,
        \`monthly_amount\` DECIMAL(15, 2) DEFAULT 0,
        \`created_at\` DATETIME,
        \`updated_at\` DATETIME,
        KEY \`idx_student_id\` (\`student_id\`),
        KEY \`idx_sponsor_id\` (\`sponsor_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'bank_transactions',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`bank_transactions\` (
        \`id\` INT PRIMARY KEY,
        \`sponsor_id\` INT,
        \`transaction_code\` VARCHAR(100),
        \`bank_name\` VARCHAR(100),
        \`account_number\` VARCHAR(100),
        \`transfer_date\` DATETIME,
        \`amount\` DECIMAL(15, 2) DEFAULT 0,
        \`transfer_content\` TEXT,
        \`status_id\` INT,
        \`verified_by\` INT,
        \`verified_at\` DATETIME,
        \`created_at\` DATETIME,
        KEY \`idx_sponsor_id\` (\`sponsor_id\`),
        KEY \`idx_status_id\` (\`status_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'support_disbursements',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`support_disbursements\` (
        \`id\` INT PRIMARY KEY,
        \`bank_transaction_id\` INT,
        \`sponsor_student_id\` INT,
        \`student_id\` VARCHAR(50),
        \`teacher_id\` INT,
        \`support_month\` INT,
        \`support_year\` INT,
        \`amount\` DECIMAL(15, 2) DEFAULT 0,
        \`delivered_at\` DATETIME,
        \`status_id\` INT,
        \`created_at\` DATETIME,
        KEY \`idx_bank_transaction_id\` (\`bank_transaction_id\`),
        KEY \`idx_sponsor_student_id\` (\`sponsor_student_id\`),
        KEY \`idx_student_id\` (\`student_id\`),
        KEY \`idx_teacher_id\` (\`teacher_id\`),
        KEY \`idx_status_id\` (\`status_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'images',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`images\` (
        \`id\` INT PRIMARY KEY,
        \`student_id\` VARCHAR(50),
        \`event_id\` VARCHAR(100),
        \`timestamp\` DATETIME,
        \`url\` VARCHAR(500),
        \`metadata\` JSON,
        KEY \`idx_student_id\` (\`student_id\`),
        KEY \`idx_event_id\` (\`event_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    table: 'logs',
    createSql: `
      CREATE TABLE IF NOT EXISTS \`logs\` (
        \`id\` INT PRIMARY KEY,
        \`timestamp\` DATETIME,
        \`user_id\` VARCHAR(50),
        \`action\` VARCHAR(100),
        \`details\` TEXT,
        \`status\` VARCHAR(50),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_action\` (\`action\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  }
];

/**
 * Load mock datasets from backend/data/*.json
 */
function loadMockData() {
  const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));

  const roles = readJson('roles.json');
  const actions = readJson('actions.json');
  const resources = readJson('resources.json');
  const permissions = readJson('permissions.json');
  const rolePermissions = readJson('role_permissions.json');
  const studentStatuses = readJson('student_statuses.json');
  const bankTransactionStatuses = readJson('bank_transaction_statuses.json');
  const disbursementStatuses = readJson('disbursement_statuses.json');
  const accounts = readJson('accounts.json');
  const schools = readJson('schools.json');
  const teachers = readJson('teachers.json');
  const volunteers = readJson('volunteers.json');
  const sponsors = readJson('sponsors.json');
  const students = readJson('students.json');
  const teacherStudents = readJson('teacher_students.json');
  const volunteerStudents = readJson('volunteer_students.json');
  const sponsorStudents = readJson('sponsor_students.json');
  const bankTransactions = readJson('bank_transactions.json');
  const supportDisbursements = readJson('support_disbursements.json');
  const images = readJson('images.json');
  const logs = readJson('logs.json');

  return [
    { table: 'roles', data: roles, primaryKey: 'id' },
    { table: 'actions', data: actions, primaryKey: 'id' },
    { table: 'resources', data: resources, primaryKey: 'id' },
    { table: 'permissions', data: permissions, primaryKey: 'id' },
    { table: 'role_permissions', data: rolePermissions, primaryKey: 'id' },
    { table: 'student_statuses', data: studentStatuses, primaryKey: 'id' },
    { table: 'bank_transaction_statuses', data: bankTransactionStatuses, primaryKey: 'id' },
    { table: 'disbursement_statuses', data: disbursementStatuses, primaryKey: 'id' },
    { table: 'accounts', data: accounts, primaryKey: 'id' },
    { table: 'schools', data: schools, primaryKey: 'id' },
    { table: 'teachers', data: teachers, primaryKey: 'id' },
    { table: 'volunteers', data: volunteers, primaryKey: 'id' },
    { table: 'sponsors', data: sponsors, primaryKey: 'id' },
    { table: 'students', data: students, primaryKey: 'id' },
    { table: 'teacher_students', data: teacherStudents, primaryKey: 'id' },
    { table: 'volunteer_students', data: volunteerStudents, primaryKey: 'id' },
    { table: 'sponsor_students', data: sponsorStudents, primaryKey: 'id' },
    { table: 'bank_transactions', data: bankTransactions, primaryKey: 'id' },
    { table: 'support_disbursements', data: supportDisbursements, primaryKey: 'id' },
    { table: 'images', data: images, primaryKey: 'id' },
    { table: 'logs', data: logs, primaryKey: 'id' }
  ];
}

/**
 * Batch Upsert Helper:
 * Inserts in chunks and updates existing rows on duplicate primary key.
 */
async function batchUpsert(connection, tableName, rows, primaryKey = 'id', batchSize = 50) {
  if (!rows || rows.length === 0) return 0;

  // Extract all unique columns
  const columns = Array.from(
    new Set(rows.flatMap(row => Object.keys(row)))
  );

  // Exclude primary key from update assignment
  const updateCols = columns.filter(col => col !== primaryKey);

  const updateClause = updateCols.length > 0
    ? updateCols.map(col => `\`${col}\` = VALUES(\`${col}\`)`).join(', ')
    : `\`${primaryKey}\` = VALUES(\`${primaryKey}\`)`;

  let totalProcessed = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);

    const rowPlaceholders = chunk
      .map(() => `(${columns.map(() => '?').join(', ')})`)
      .join(', ');

    const values = chunk.flatMap(row =>
      columns.map(col => {
        const val = row[col];
        if (val === undefined) return null;
        if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
          return JSON.stringify(val);
        }
        return val;
      })
    );

    const sql = `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')})
                 VALUES ${rowPlaceholders}
                 ON DUPLICATE KEY UPDATE ${updateClause};`;

    await connection.query(sql, values);
    totalProcessed += chunk.length;
  }

  return totalProcessed;
}

/**
 * Main initialization routine
 */
async function initDatabase() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('  TiDB / MySQL Automated Database Initialization');
  console.log('====================================================');
  console.log(`Connecting to Host : ${DB_HOST}:${DB_PORT}`);
  console.log(`Target Database    : ${DB_SCHEMA}`);
  console.log(`Batch Size         : ${BATCH_SIZE}`);

  const sslConfig = getSslConfig();
  console.log(`TLS / SSL Status   : ${sslConfig ? 'ENABLED' : 'DISABLED'}`);

  let connection;
  try {
    // 1. Establish connection to TiDB server (without selecting DB first)
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      ssl: sslConfig
    });
    console.log(' Connected to TiDB server successfully.');

    // 2. Create database if it does not exist
    console.log(`\n Ensuring database "${DB_SCHEMA}" exists...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_SCHEMA}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.query(`USE \`${DB_SCHEMA}\`;`);
    console.log(` Selected database "${DB_SCHEMA}".`);

    // Temporarily disable foreign key checks during creation and data upsert
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 3. Create tables if they do not exist
    console.log('\n Creating tables if not exist...');
    for (const schema of TABLE_SCHEMAS) {
      await connection.query(schema.createSql);
      console.log(`   Table ready: ${schema.table}`);
    }

    // Compatibility view for role_permission
    await connection.query('CREATE OR REPLACE VIEW `role_permission` AS SELECT * FROM `role_permissions`;');

    // 4. Load mock data from JavaScript files
    console.log('\n Reading mock data from backend/data...');
    const datasets = loadMockData();

    // 5. Upsert mock data in batches
    console.log('\n Upserting mock data in batches (ON DUPLICATE KEY UPDATE)...');
    const summary = [];
    let grandTotalRecords = 0;

    for (const item of datasets) {
      process.stdout.write(`   Processing [${item.table}] (${item.data.length} records)... `);
      const processed = await batchUpsert(
        connection,
        item.table,
        item.data,
        item.primaryKey,
        BATCH_SIZE
      );
      console.log(` Done (${processed} processed).`);
      summary.push({ table: item.table, count: processed });
      grandTotalRecords += processed;
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // 6. Display summary report
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n====================================================');
    console.log('             Summary of Processed Records');
    console.log('====================================================');
    console.table(summary);
    console.log(` Total Tables Processed  : ${summary.length}`);
    console.log(` Total Records Processed : ${grandTotalRecords}`);
    console.log(` Completed In            : ${duration}s`);
    console.log('====================================================');
  } catch (err) {
    console.error('\n Initialization failed with error:');
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
      console.log(' Database connection closed.');
    }
  }
}

// Execute when run directly
if (require.main === module) {
  initDatabase();
}

module.exports = {
  initDatabase,
  getSslConfig,
  batchUpsert,
  loadMockData,
  TABLE_SCHEMAS
};
