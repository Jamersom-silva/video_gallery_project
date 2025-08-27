const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || 'https://video-gallery-project-1.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';


const dbPath = path.join('/opt/render/project', 'gallery.db'); 
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Banco conectado com sucesso!');
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

app.use(cors());
app.use(express.json());


const uploadsDir = path.join('/opt/render/project', 'uploads'); 
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${sanitized}`);
  }
});
const upload = multer({ storage });

// --- ROTAS ---

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Campos faltando' });

  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err){
    if(err) return res.status(400).json({ message: 'Usuário já existe' });
    res.json({ success: true, userId: this.lastID });
  });
});


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


app.post('/media/upload', authMiddleware, upload.single('file'), (req, res) => {
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


app.get('/media/list', authMiddleware, (req, res) => {
  db.all(`SELECT * FROM media WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if(err) return res.status(500).json({ message: 'Erro ao listar mídias' });
    const items = rows.map(r => ({
      id: r.id,
      title: r.originalname,
      filename: r.filename,
      type: r.type,
      url: `${BASE_URL}/uploads/${r.filename}`
    }));
    res.json(items);
  });
});


app.get('/media/download/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM media WHERE id = ? AND user_id = ?`, [id, req.user.id], (err, row) => {
    if(err || !row) return res.status(404).json({ message: 'Mídia não encontrada' });
    const filePath = path.join(uploadsDir, row.filename);
    res.download(filePath, row.originalname);
  });
});


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
