const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  type: { // e.g., "base", "sauce", "cheese", "veggie", "meat"
    type: String,
    required: true,
    lowercase: true,
  },
  name: { // e.g., "Thin Crust", "Tomato Basil", "Mozzarella", "Onion", "Chicken"
    type: String,
    required: true,
    unique: true, // Item names should be unique for easy lookup
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  threshold: { // Admin notification threshold
    type: Number,
    required: true,
    default: 20,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);