const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbFile = process.env.NODE_ENV === "test" ? "dealership.test.db" : "dealership.db";
const db = new DatabaseSync(path.join(__dirname, "../../" + dbFile));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT "user"
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
  );
`);

module.exports = db;
