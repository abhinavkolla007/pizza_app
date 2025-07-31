const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const Inventory = require("../models/inventory");
const Pizza = require("../models/pizza");
const nodemailer = require("nodemailer");

const ADMIN_EMAIL = "abhinavkolla007@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------- INVENTORY ROUTES --------------------

router.get("/inventory", protect, isAdmin, async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/inventory", protect, isAdmin, async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/inventory/:id", protect, isAdmin, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.stock < item.threshold) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `⚠️ Low Stock Alert: ${item.name}`,
        html: `<p><strong>${item.name}</strong> is low on stock: <strong>${item.stock}</strong> (threshold: ${item.threshold})</p>`,
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.delete("/inventory/:id", protect, isAdmin, async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- ORDER ROUTES --------------------

router.get("/orders", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Pizza.find().populate("userId", "email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/orders/:id/status", protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Pizza.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;