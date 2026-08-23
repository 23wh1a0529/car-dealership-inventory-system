const express = require("express");
const { create, list, search, update, remove } = require("../controllers/vehicleController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, create);
router.get("/search", authenticate, search);
router.get("/", authenticate, list);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, requireAdmin, remove);

module.exports = router;
