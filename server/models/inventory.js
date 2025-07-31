const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., base, sauce, cheese, veggie, meat
  name: { type: String, required: true }, // e.g., "Thin Crust", "Tomato Sauce"
  quantity: { type: Number, required: true, default: 0 },
  threshold: { type: Number, required: true, default: 20 } // for low stock alerts
});

module.exports = mongoose.model("Inventory", inventorySchema);