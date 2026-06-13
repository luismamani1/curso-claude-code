const fs = require('fs');
const path = require('path');

module.exports = async function globalSetup() {
  const dbPath = path.join(__dirname, '../kohi.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
};
