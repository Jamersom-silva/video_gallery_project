const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho atualizado para o banco de dados dentro da pasta backend/data
const dbPath = path.join(__dirname, '../data/gallery.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao SQLite em', dbPath);
  }
});

// Exporta métodos básicos com promises
module.exports = {
  run: (sql, params=[]) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err){
      if(err) reject(err); else resolve(this);
    });
  }),
  get: (sql, params=[]) => new Promise((resolve, reject) => {
    db.get(sql, params, (err,row)=>{ if(err) reject(err); else resolve(row); });
  }),
  all: (sql, params=[]) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows)=>{ if(err) reject(err); else resolve(rows); });
  })
};
