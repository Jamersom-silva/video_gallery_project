const express = require('express');
const router = express.Router();
const { run, get } = require('../db'); // funções promisificadas
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret'; // chave JWT

// Registrar usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const existing = await get('SELECT * FROM users WHERE username=?', [username]);
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    await run('INSERT INTO users(username,password) VALUES (?,?)', [username, password]);
    const user = await get('SELECT * FROM users WHERE username=?', [username]);
    const token = jwt.sign({ username: user.username, id: user.id }, SECRET);
    res.json({ user, token });
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Login usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await get('SELECT * FROM users WHERE username=? AND password=?', [username, password]);
    if (!user) return res.status(400).json({ error: 'Invalid username/password' });

    const token = jwt.sign({ username: user.username, id: user.id }, SECRET);
    res.json({ user, token });
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
