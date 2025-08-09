const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const Order = require('../models/Order');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { sendLowStockNotification } = require('../utils/emailService');

router.post('/inventory', protect, authorizeRoles('admin'), async (req, res) => {
  const { type, name, stock, threshold } = req.body;
  try {
    const newItem = new Inventory({ type, name, stock, threshold });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add inventory item' });
  }
});

router.get('/inventory', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch inventory items' });
  }
});

router.put('/inventory/:id', protect, authorizeRoles('admin'), async (req, res) => {
  const { stock } = req.body;
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (item.stock < item.threshold) {
      await sendLowStockNotification(item.name, item.stock, item.threshold);
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update inventory item' });
  }
});

router.delete('/inventory/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete inventory item' });
  }
});

router.get('/orders', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
});

router.put('/orders/:id/status', protect, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;