import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const isProduction = process.env.NODE_ENV === 'production';

// PostgreSQL pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Use strict validation in production if possible
});

// Check database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err.message);
    process.exit(1); // Exit the process if unable to connect
  }
})();

export { pool };
