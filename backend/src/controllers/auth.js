const express = require('express');
const router = express.Router();
const db = require('../db'); // corrigido
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret'; // para JWT

// Registrar usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const existing = await db.get('SELECT * FROM users WHERE username=?', [username]);
  if (existing) return res.status(400).json({ error: 'Username already exists' });

  await db.run('INSERT INTO users(username,password) VALUES (?,?)', [username, password]);
  const user = await db.get('SELECT * FROM users WHERE username=?', [username]);
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET);
  res.json({ user, token });
});

// Login usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username=? AND password=?', [username, password]);
  if (!user) return res.status(400).json({ error: 'Invalid username/password' });

  const token = jwt.sign({ username: user.username, id: user.id }, SECRET);
  res.json({ user, token });
});

module.exports = router;
