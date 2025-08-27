const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.join(__dirname, '../../data/gallery.db'); 

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Banco conectado com sucesso!');
  }
});


const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if(err) reject(err); else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err,row) => {
    if(err) reject(err); else resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if(err) reject(err); else resolve(rows);
  });
});


db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  originalname TEXT,
  filename TEXT,
  type TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = { db, run, get, all };
