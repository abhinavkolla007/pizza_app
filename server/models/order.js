const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  base: {
    type: String,
    required: true,
  },
  sauce: {
    type: String,
    required: true,
  },
  cheese: {
    type: String,
    required: true,
  },
  veggies: {
    type: [String], // Array of strings
    default: [],
  },
  meat: {
    type: [String], // Array of strings
    default: [],
  },
  status: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered'],
    default: 'Order Received',
  },
  paymentId: { // Razorpay payment ID
    type: String,
    required: true,
  },
  orderId: { // Razorpay order ID
    type: String,
    required: true,
  },
  signature: { // Razorpay signature
    type: String,
    required: true,
  },
  amount: { // Store the amount for reference
    type: Number,
    default: 299, // Assuming fixed price for now
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);