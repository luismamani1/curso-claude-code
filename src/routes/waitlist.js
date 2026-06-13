const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
  const user = db.get(
    'SELECT name, email, waitlist_position, invite_code FROM users WHERE id = ?',
    [req.user.userId]
  );

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const total = db.get('SELECT COUNT(*) as count FROM users');
  res.json({ ...user, total_registered: total.count });
});

module.exports = router;
