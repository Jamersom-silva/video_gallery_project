const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET = 'supersecret';

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
router.post('/upload', authMiddleware, upload.single('media'), async (req, res) => {
  const file = req.file;
  if(!file) return res.status(400).json({ message: 'Arquivo não enviado' });

  try {
    await run('INSERT INTO media(user_id, originalname, filename, type) VALUES(?, ?, ?, ?)', 
      [req.user.id, file.originalname, file.filename, file.mimetype.startsWith('image/') ? 'image' : 'video']);
    res.json({ message: 'Upload realizado!' });
  } catch(err) {
    res.status(500).json({ message: 'Erro ao salvar no banco' });
  }
});

// List
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM media WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ message: 'Erro ao listar' });
  }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const row = await get('SELECT * FROM media WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    if(!row) return res.status(404).json({ message: 'Arquivo não encontrado' });

    const filePath = path.join(__dirname, '../../uploads', String(req.user.id), row.filename);
    fs.unlinkSync(filePath);

    await run('DELETE FROM media WHERE id=?', [req.params.id]);
    res.json({ message: 'Arquivo deletado' });
  } catch(err) {
    res.status(500).json({ message: 'Erro ao deletar' });
  }
});

module.exports = router;
