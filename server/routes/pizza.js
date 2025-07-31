const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");

const router = express.Router();

// Middleware: Protect
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware: isAdmin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Place an order (protected)
router.post("/order", protect, async (req, res) => {
  try {
    const { base, sauce, cheese, veggies, meat } = req.body;

    const order = new Order({
      userId: req.user.id,
      base,
      sauce,
      cheese,
      veggies,
      meat,
      status: "Pending"
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: "Server error while placing order" });
  }
});

// Get user's orders (protected)
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});

module.exports = router;