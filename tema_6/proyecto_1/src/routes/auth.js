const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { getEmailError } = require('../utils/emailValidator');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'El nombre es requerido.' });
  }

  const emailError = getEmailError(email);
  if (emailError) return res.status(400).json({ error: emailError });

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const existing = db.get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  if (existing) {
    return res.status(409).json({ error: 'Este email ya está registrado.' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const invite_code = uuidv4();

  const maxRow = db.get('SELECT MAX(waitlist_position) as max FROM users');
  const waitlist_position = (maxRow && maxRow.max != null ? maxRow.max : 0) + 1;

  db.run(
    'INSERT INTO users (name, email, password_hash, waitlist_position, invite_code) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), email.trim().toLowerCase(), password_hash, waitlist_position, invite_code]
  );

  const user = db.get('SELECT id, name, email, waitlist_position, invite_code FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, user: { name: user.name, waitlist_position: user.waitlist_position, invite_code: user.invite_code } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const user = db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: { name: user.name, waitlist_position: user.waitlist_position, invite_code: user.invite_code } });
});

module.exports = router;
