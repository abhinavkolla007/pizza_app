const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { sendLowStockNotification } = require('../utils/emailService');

const decrementStock = async (itemName, quantity = 1) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { name: itemName },
      { $inc: { stock: -quantity } },
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

router.post('/order', protect, authorizeRoles('user'), async (req, res) => {
  const { base, sauce, cheese, veggies, meat, paymentId, orderId, signature } = req.body;

  if (!base || !sauce || !cheese || !paymentId || !orderId || !signature) {
    return res.status(400).json({ message: 'Missing required pizza components or payment details.' });
  }

  try {
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
      userId: req.user.id,
      base,
      sauce,
      cheese,
      veggies,
      meat,
      paymentId,
      orderId,
      signature,
      amount: 299,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pizza order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place pizza order', error: error.message });
  }
});

router.get('/my-orders', protect, authorizeRoles('user'), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

router.get('/options', async (req, res) => {
  try {
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