const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Order = require('../models/Order'); // Import Order model for admin orders
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { sendLowStockNotification } = require('../utils/emailService');

// @route   POST /api/admin/inventory
// @desc    Add a new inventory item
// @access  Private (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
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

// @route   GET /api/admin/inventory
// @desc    Get all inventory items
// @access  Private (Admin only)
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch inventory items' });
  }
});

// @route   PUT /api/admin/inventory/:id
// @desc    Update stock of an inventory item and check threshold
// @access  Private (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  const { stock } = req.body;
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check for low stock after update
    if (item.stock < item.threshold) {
      await sendLowStockNotification(item.name, item.stock, item.threshold);
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update inventory item' });
  }
});

// @route   DELETE /api/admin/inventory/:id
// @desc    Delete an inventory item
// @access  Private (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
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

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private (Admin only)
router.get('/orders', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    // Populate userId to get user's email
    const orders = await Order.find({}).populate('userId', 'email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin only)
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