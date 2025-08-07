const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', protect, authorizeRoles('user'), async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});

module.exports = router;