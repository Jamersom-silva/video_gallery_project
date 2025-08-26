const express = require('express');
const router = express.Router();
const db = require('../middlewares/db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET = 'mysecretkey';

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id;
    const dir = path.join(__dirname, '../../uploads', String(userId));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Middleware auth
function authMiddleware(req, res, next){
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'Token não fornecido' });
  jwt.verify(token, SECRET, (err, user) => {
    if(err) return res.status(401).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Upload
router.post('/upload', authMiddleware, upload.single('media'), (req, res) => {
  const file = req.file;
  if(!file) return res.status(400).json({ message: 'Arquivo não enviado' });

  const stmt = db.prepare('INSERT INTO media(user_id, originalname, filename, type) VALUES(?, ?, ?, ?)');
  stmt.run(req.user.id, file.originalname, file.filename, file.mimetype.startsWith('image/') ? 'image' : 'video', function(err){
    if(err) return res.status(500).json({ message: 'Erro ao salvar no banco' });
    res.json({ id: this.lastID, message: 'Upload realizado!' });
  });
});

// List
router.get('/list', authMiddleware, (req, res) => {
  db.all('SELECT * FROM media WHERE user_id=? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if(err) return res.status(500).json({ message: 'Erro ao listar' });
    res.json(rows);
  });
});

// Delete
router.delete('/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM media WHERE id=? AND user_id=?', [id, req.user.id], (err, row) => {
    if(err || !row) return res.status(404).json({ message: 'Arquivo não encontrado' });
    const filePath = path.join(__dirname, '../../uploads', String(req.user.id), row.filename);
    fs.unlinkSync(filePath);
    db.run('DELETE FROM media WHERE id=?', [id], err => {
      if(err) return res.status(500).json({ message: 'Erro ao deletar' });
      res.json({ message: 'Arquivo deletado' });
    });
  });
});

module.exports = router;
