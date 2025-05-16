import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt"

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

// Insert Admin user if the table is empty
const hashedPW = await bcrypt.hash(process.env.Admin_PW, 10)
const userCount = await db.get('SELECT COUNT(*) AS count FROM login');
if (userCount.count === 0) {
  await db.run('INSERT INTO login (name, password, admin_status) VALUES (?, ?, ?)', process.env.Admin_UN, hashedPW, 1);
}

// Export the database connection
export default db;