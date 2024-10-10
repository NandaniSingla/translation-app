const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || "default",
  host:
    process.env.POSTGRES_HOST ||
    "ep-green-sky-a4bxy1ph-pooler.us-east-1.aws.neon.tech",
  database: process.env.POSTGRES_DATABASE || "verceldb",
  password: process.env.POSTGRES_PASSWORD || "D8bAhSF0MlLx",
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Enable SSL if needed
});

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
    console.error("Error creating table:", error);
  }
};

// Create the table when the server starts
createTableIfNotExists();

// Route for handling POST requests
app.post("/api/translations", async (req, res) => {
  const { original_message, translated_message, language, model } = req.body;

  // Input validation
  if (!original_message || !translated_message || !language || !model) {
    return res
      .status(400)
      .json({
        error:
          "Missing required fields: original_message, translated_message, language, model",
      });
  }

  try {
    const result = await pool.query(
      "INSERT INTO translations (original_message, translated_message, language, model) VALUES ($1, $2, $3, $4) RETURNING *",
      [original_message, translated_message, language, model]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database insertion error:", error);
    res.status(500).json({ error: "Database insertion error" });
  }
});

// Route for handling GET requests to fetch all translations
app.get("/api/translations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM translations ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching translations:", error);
    res.status(500).json({ error: "Error fetching translations" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
