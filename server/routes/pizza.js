// const express = require("express");
// const jwt = require("jsonwebtoken");
// const Order = require("../models/order");

// const router = express.Router();

// // Middleware: Protect
// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token, unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// // Middleware: isAdmin
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
// };

// // Place an order (protected)
// router.post("/order", protect, async (req, res) => {
//   try {
//     const { base, sauce, cheese, veggies, meat } = req.body;

//     const order = new Order({
//       userId: req.user.id,
//       base,
//       sauce,
//       cheese,
//       veggies,
//       meat,
//       status: "Pending"
//     });

//     await order.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (err) {
//     console.error("❌ Error placing order:", err);
//     res.status(500).json({ message: "Server error while placing order" });
//   }
// });

// // Get user's orders (protected)
// router.get("/my-orders", protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Server error while fetching orders" });
//   }
// });

// module.exports = router;

// pizza-app/server/routes/pizza.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { sendLowStockNotification } = require('../utils/emailService');

// Helper function to decrement stock and check threshold
const decrementStock = async (itemName, quantity = 1) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { name: itemName },
      { $inc: { stock: -quantity } }, // Decrement stock
      { new: true, runValidators: true }
    );

    if (item && item.stock < item.threshold) {
      await sendLowStockNotification(item.name, item.stock, item.threshold);
    }
    return item;
  } catch (error) {
    console.error(`Error decrementing stock for ${itemName}:`, error);
    throw new Error(`Failed to update stock for ${itemName}`);
  }
};


// @route   POST /api/pizza/order
// @desc    Place a new pizza order
// @access  Private (User only)
router.post('/order', protect, authorizeRoles('user'), async (req, res) => {
  const { base, sauce, cheese, veggies, meat, paymentId, orderId, signature } = req.body;

  // Basic validation (more robust validation should be done)
  if (!base || !sauce || !cheese || !paymentId || !orderId || !signature) {
    return res.status(400).json({ message: 'Missing required pizza components or payment details.' });
  }

  try {
    // Decrement stock for selected ingredients
    // Note: This is a simplified stock update. In a real app, you'd check stock *before* payment.
    // For a production app, this would be part of a transaction or more robust stock management.
    await decrementStock(base);
    await decrementStock(sauce);
    await decrementStock(cheese);
    for (const veggie of veggies) {
      await decrementStock(veggie);
    }
    for (const m of meat) {
      await decrementStock(m);
    }

    const newOrder = new Order({
      userId: req.user.id, // User ID from authenticated request
      base,
      sauce,
      cheese,
      veggies,
      meat,
      paymentId,
      orderId,
      signature,
      amount: 299, // Fixed amount for now
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pizza order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place pizza order', error: error.message });
  }
});

// @route   GET /api/pizza/my-orders
// @desc    Get orders for the logged-in user
// @access  Private (User only)
router.get('/my-orders', protect, authorizeRoles('user'), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// @route   GET /api/pizza/options
// @desc    Get available pizza options (bases, sauces, cheeses, veggies, meat) for users
// @access  Public (or Private if you want only logged-in users to see options)
router.get('/options', async (req, res) => {
  try {
    // Only return items with stock greater than 0
    const bases = await Inventory.find({ type: 'base', stock: { $gt: 0 } }).select('name');
    const sauces = await Inventory.find({ type: 'sauce', stock: { $gt: 0 } }).select('name');
    const cheeses = await Inventory.find({ type: 'cheese', stock: { $gt: 0 } }).select('name');
    const veggies = await Inventory.find({ type: 'veggie', stock: { $gt: 0 } }).select('name');
    const meats = await Inventory.find({ type: 'meat', stock: { $gt: 0 } }).select('name');

    res.status(200).json({
      bases: bases.map(item => item.name),
      sauces: sauces.map(item => item.name),
      cheeses: cheeses.map(item => item.name),
      veggies: veggies.map(item => item.name),
      meats: meats.map(item => item.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pizza options' });
  }
});

module.exports = router;