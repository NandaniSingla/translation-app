const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
    user: "translation_app_nc77_user",
    host: "dpg-cro3r2d6l47c73an72q0-a",
    database: "translation_app_nc77",
    password: "nBia9zLEQU4vOLYVomJCHvJcMIv0h6ix",
    port: 5432,
  });
  module.exports = pool;