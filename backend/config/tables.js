import { pool } from './db.js';

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
`;

const createtodosTable = `
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    priority INT CHECK (priority BETWEEN 1 AND 5),
    status VARCHAR(50) CHECK (status IN ('pending', 'finished')) NOT NULL
);
`;

export async function initializeDatabase() {
    try {
        const client = await pool.connect();
        await client.query(createUsersTable);
        await client.query(createtodosTable);
        console.log('Tables created successfully.');
        client.release(); // Ensure this line is not commented.
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}
