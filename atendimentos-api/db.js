const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

if (process.env.DB_TYPE === 'postgres') {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'atendimentos',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  });

  // Initialize table
  pool.query(`
    CREATE TABLE IF NOT EXISTS atendimentos (
      id SERIAL PRIMARY KEY,
      nome TEXT,
      contato TEXT,
      status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => console.error('Error creating table:', err));

  db = pool;
} else {
  // Default to SQLite
  const dbFile = path.join(__dirname, 'data.sqlite');
  db = new sqlite3.Database(dbFile);

  // initialize table
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS atendimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        contato TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

module.exports = db;
