import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
const db = await open({
  filename: process.env.DATABASE_FILE || './database.sqlite',
  driver: sqlite3.Database,
});

// Create the posts table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message VARCHAR(255),
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
// Create the comments table if it doesn't exist
await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message VARCHAR(255),
      author_id INTEGER,
      post_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
// Create the login table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    admin_status TINYINT(1) DEFAULT 0
  );
`);

// Insert a default user if the table is empty
const userCount = await db.get('SELECT COUNT(*) AS count FROM login');
if (userCount.count === 0) {
  await db.run('INSERT INTO login (name, password, admin_status) VALUES (?, ?, ?)', 'orskitorski', '$2b$10$j5CmQunEEQImQhR3n1HR3eAfq6az6SVogGAPsoOPDIaWZ/v32IxAK', 1);
}

// Export the database connection
export default db;