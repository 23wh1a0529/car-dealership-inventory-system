const express = require("express");
const { create, list } = require("../controllers/vehicleController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, create);
router.get("/", authenticate, list);

module.exports = router;
