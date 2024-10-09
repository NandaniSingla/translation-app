const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: "translation_app_nc77_user",
  host: "dpg-cro3r2d6l47c73an72q0-a",
  database: "translation_app_nc77",
  password: "nBia9zLEQU4vOLYVomJCHvJcMIv0h6ix",
  port: 5432,
});
module.exports = pool;

// Function to create the table if it doesn't exist
const createTableIfNotExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS translations (
      id SERIAL PRIMARY KEY,
      original_message TEXT NOT NULL,
      translated_message TEXT NOT NULL,
      language VARCHAR(50) NOT NULL,
      model VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table "translations" is ready.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Create the table when the server starts
createTableIfNotExists();

// Route for handling POST requests
app.post('/api/translations', async (req, res) => {
  const { original_message, translated_message, language, model } = req.body;
  if (!original_message || !translated_message || !language || !model) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO translations (original_message, translated_message, language, model) VALUES ($1, $2, $3, $4) RETURNING *',
      [original_message, translated_message, language, model]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ error: 'Database insertion error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});