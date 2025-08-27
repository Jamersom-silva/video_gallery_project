const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get } = require('../middlewares/db');

const router = express.Router();
const SECRET = 'segredo-supersecreto'; // troque para variavel de ambiente

// Registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Usuário e senha obrigatórios' });

  const hashed = await bcrypt.hash(password, 10);

  try {
    await run('INSERT INTO users(username, password) VALUES (?,?)', [username, hashed]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Usuário já existe' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await get('SELECT * FROM users WHERE username=?', [username]);
  if (!user) return res.status(400).json({ success: false, message: 'Usuário não encontrado' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ success: false, message: 'Senha incorreta' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
  res.json({ success: true, token, username: user.username });
});

module.exports = router;
