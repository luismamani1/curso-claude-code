CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,
  email             TEXT    UNIQUE NOT NULL,
  password_hash     TEXT    NOT NULL,
  waitlist_position INTEGER UNIQUE NOT NULL,
  invite_code       TEXT    UNIQUE NOT NULL,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);
