const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../middlewares/db');
const authenticate = require('../middlewares/auth'); // seu middleware JWT

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    // Remove caracteres especiais e espaços
    const cleanName = file.originalname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
    cb(null, Date.now() + '_' + cleanName);
  }
});
const upload = multer({ storage });

// Upload
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    if(!file) return res.status(400).json({ success:false, message:'Arquivo não enviado' });

    const type = file.mimetype.startsWith('image') ? 'image' : 'video';

    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO media(user_id, originalname, filename, type) VALUES(?,?,?,?)',
        [req.user.id, file.originalname, file.filename, type],
        err => err ? reject(err) : resolve()
      );
    });

    res.json({ success:true, message:'Upload realizado!' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Erro no upload' });
  }
});

// Listar mídias do usuário
router.get('/list', authenticate, async (req, res) => {
  try {
    const items = await new Promise((resolve, reject) => {
      db.all('SELECT id, originalname, filename, type FROM media WHERE user_id=? ORDER BY id DESC', [req.user.id],
        (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Gerar URLs acessíveis
    const mapped = items.map(i => ({
      id: i.id,
      title: i.originalname,
      description: '',
      type: i.type,
      url: `http://localhost:4000/uploads/${i.filename}`
    }));

    res.json(mapped);
  } catch(err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Download
router.get('/download/:id', authenticate, async (req, res) => {
  try {
    const mediaId = req.params.id;
    const userId = req.user.id;

    const media = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM media WHERE id=? AND user_id=?', [mediaId, userId], (err,row) => err ? reject(err) : resolve(row));
    });

    if(!media) return res.status(404).json({ error:'Arquivo não encontrado' });

    const filePath = path.join(__dirname, '../../uploads', media.filename);
    res.download(filePath, media.originalname);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error:'Erro ao baixar arquivo' });
  }
});

module.exports = router;
