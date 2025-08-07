const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  threshold: {
    type: Number,
    required: true,
    default: 20,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);