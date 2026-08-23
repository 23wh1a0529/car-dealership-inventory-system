const bcrypt = require("bcryptjs");
const db = require("../db/database");
const AppError = require("../utils/AppError");

function validateRegisterInput(email, password) {
  if (!email || !email.includes("@")) {
    throw new AppError("A valid email is required", 400);
  }
  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
}

function registerUser(email, password) {
  validateRegisterInput(email, password);

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashed = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)")
    .run(email, hashed, "user");

  return { message: "User registered successfully" };
}

module.exports = { registerUser };
