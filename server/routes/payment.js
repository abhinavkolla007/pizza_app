const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Razorpay order", error: err.message });
  }
});

router.post("/verify", (req, res) => {
  console.log("✅ /api/payment/verify HIT");
  res.json({ message: "Payment verified successfully (placeholder)" });
});

module.exports = router;
