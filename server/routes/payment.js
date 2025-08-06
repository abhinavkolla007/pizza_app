// const express = require("express");
// const Razorpay = require("razorpay");
// const dotenv = require("dotenv");

// dotenv.config();
// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// router.post("/create-order", async (req, res) => {
//   const { amount } = req.body;
//   try {
//     const options = {
//       amount: amount * 100,
//       currency: "INR",
//       receipt: "receipt_order_" + Date.now(),
//     };
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create Razorpay order", error: err.message });
//   }
// });

// router.post("/verify", (req, res) => {
//   console.log("✅ /api/payment/verify HIT");
//   res.json({ message: "Payment verified successfully (placeholder)" });
// });

// module.exports = router;



// pizza-app/server/routes/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private (User only) - protected to ensure only logged-in users can initiate
router.post('/create-order', protect, authorizeRoles('user'), async (req, res) => {
  const { amount } = req.body; // Amount in rupees

  const options = {
    amount: amount * 100, // amount in paisa
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1 // auto capture
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});

// Note: For a production application, you would also implement a webhook endpoint
// to verify payment signatures on the server-side after Razorpay sends a callback.
// This is crucial for security and preventing fraud.
// Example: router.post('/payment/verify-webhook', (req, res) => { ... });

module.exports = router;