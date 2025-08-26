const express = require('express');
const router = express.Router();
const db = require('../middlewares/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = 'mysecretkey';

// Registrar
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Preencha usuário e senha' });

  const hash = await bcrypt.hash(password, 10);

  const stmt = db.prepare('INSERT INTO users(username, password) VALUES(?, ?)');
  stmt.run(username, hash, function(err) {
    if(err) return res.status(400).json({ message: 'Usuário já existe' });
    const token = jwt.sign({ id: this.lastID, username }, SECRET);
    res.json({ user: { id: this.lastID, username }, token, message: 'Cadastrado com sucesso!' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username=?', [username], async (err, user) => {
    if(err || !user) return res.status(400).json({ message: 'Usuário não encontrado' });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ message: 'Senha incorreta' });
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
    res.json({ user: { id: user.id, username: user.username }, token, message: 'Login realizado!' });
  });
});

module.exports = router;
