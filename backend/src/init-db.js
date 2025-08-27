const db = require('./middlewares/db'); // CORRIGIDO
const fs = require('fs');
const path = require('path');

async function init() {
  try {
    
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    
    await db.run('DROP TABLE IF EXISTS users');
    await db.run('DROP TABLE IF EXISTS media');

    
    await db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

    // Cria tabela de mídia
    await db.run(`CREATE TABLE media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      originalname TEXT,
      filename TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    console.log('Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
    process.exit(1);
  }
}

init();