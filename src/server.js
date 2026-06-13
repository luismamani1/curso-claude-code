require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db/database');
const authRoutes = require('./routes/auth');
const waitlistRoutes = require('./routes/waitlist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api', waitlistRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kōhi server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });

module.exports = app;
