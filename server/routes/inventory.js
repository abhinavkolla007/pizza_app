const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth");
const Inventory = require("../models/inventory");

// Get all inventory items (admin only)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory" });
  }
});

// Update inventory item quantity (admin only)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating inventory" });
  }
});

module.exports = router;