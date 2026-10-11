/**
 * Root wrapper to run backend/init-db.js
 */
const { initDatabase } = require('./backend/init-db.js');

if (require.main === module) {
  initDatabase();
}

module.exports = require('./backend/init-db.js');
