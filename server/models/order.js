const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    type: [String],
    default: [],
  },
  meat: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered'],
    default: 'Order Received',
  },
  paymentId: { 
    type: String,
    required: true,
  },
  orderId: { 
    type: String,
    required: true,
  },
  signature: { 
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 299,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);