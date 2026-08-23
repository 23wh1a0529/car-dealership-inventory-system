const { registerUser } = require("../services/authService");

function register(req, res) {
  try {
    const { email, password } = req.body;
    const result = registerUser(email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

module.exports = { register };
