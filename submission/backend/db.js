const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Optional: test connection
pool.connect()
  .then(() => console.log("✅ Connected to Neon DB"))
  .catch((err) => console.error("DB connection error:", err));

module.exports = pool;