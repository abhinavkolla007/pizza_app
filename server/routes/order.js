const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Pizza = require("../models/pizza");
const Inventory = require("../models/inventory");
const nodemailer = require("nodemailer");

// GET /my-orders - fetch user's orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Pizza.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to load orders", error: err.message });
  }
});

// POST /place - place order and update stock
router.post("/place", protect, async (req, res) => {
  const { base, sauce, cheese, veggies = [], meat = [] } = req.body;

  try {
    const order = new Pizza({
      userId: req.user._id,
      base,
      sauce,
      cheese,
      veggies,
      meat,
      status: "Order Received",
    });
    await order.save();

    // Function to deduct stock and send email alert if low
    const deductStock = async (type, name) => {
      const item = await Inventory.findOne({ type, name });
      if (item) {
        item.quantity -= 1; // changed from item.stock
        await item.save();

        if (item.quantity < item.threshold) { // changed from item.stock
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            to: process.env.ADMIN_EMAIL || "abhinavkolla007@gmail.com",
            subject: `⚠️ Low Stock Alert: ${item.name}`,
            html: `<p>The stock for <strong>${item.name}</strong> (${item.type}) is below the threshold.<br/>Remaining: <strong>${item.quantity}</strong></p>`, // changed from item.stock
          };

          await transporter.sendMail(mailOptions);
        }
      }
    };

    await deductStock("base", base);
    await deductStock("sauce", sauce);
    await deductStock("cheese", cheese);
    for (const veg of veggies) await deductStock("veggies", veg);
    for (const m of meat) await deductStock("meat", m);

    res.status(201).json({ message: "✅ Order placed successfully!" });
  } catch (err) {
    console.error("❌ Order failed:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

module.exports = router;