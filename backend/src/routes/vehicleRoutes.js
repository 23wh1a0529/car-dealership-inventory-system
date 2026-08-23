const express = require("express");
const {
  create,
  list,
  search,
  update,
  remove,
  purchase,
  restock
} = require("../controllers/vehicleController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, create);
router.get("/search", authenticate, search);
router.get("/", authenticate, list);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, requireAdmin, remove);
router.post("/:id/purchase", authenticate, purchase);
router.post("/:id/restock", authenticate, requireAdmin, restock);

module.exports = router;
