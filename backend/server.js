const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'segredo123';

// Conectar banco
const dbPath = path.join(__dirname, 'data/gallery.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Banco conectado com sucesso!');
});

// Criar tabelas se não existirem
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

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const sanitized = file.originalname
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${sanitized}`);
  }
});
const upload = multer({ storage });

// --- ROTAS ---

// Registro
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Campos faltando' });

  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err){
    if(err) return res.status(400).json({ message: 'Usuário já existe' });
    res.json({ success: true, userId: this.lastID });
  });
});

// Login
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Senha incorreta' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ success: true, token, username: user.username });
  });
});

// Middleware de autenticação
function authMiddleware(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'Token faltando' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Upload mídia
app.post('/media/upload', authMiddleware, upload.single('file'), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  if(!file) return res.status(400).json({ message: 'Arquivo não enviado' });

  const type = file.mimetype.startsWith('image') ? 'image' : 'video';

  db.run(`INSERT INTO media (user_id, originalname, filename, type) VALUES (?, ?, ?, ?)`,
    [req.user.id, file.originalname, file.filename, type],
    function(err){
      if(err) return res.status(500).json({ message: 'Erro ao salvar no banco' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Listar mídias do usuário
app.get('/media/list', authMiddleware, (req, res) => {
  db.all(`SELECT * FROM media WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if(err) return res.status(500).json({ message: 'Erro ao listar mídias' });
    const items = rows.map(r => ({
      id: r.id,
      title: r.originalname,
      filename: r.filename,
      type: r.type,
      url: `http://localhost:${PORT}/uploads/${r.filename}`
    }));
    res.json(items);
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
