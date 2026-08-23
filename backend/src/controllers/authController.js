const { registerUser, loginUser } = require("../services/authService");

function register(req, res) {
  try {
    const { email, password } = req.body;
    const result = registerUser(email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

module.exports = { register, login };
