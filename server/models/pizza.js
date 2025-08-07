const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Order Received", "In Kitchen", "Out for Delivery"],
    default: "Order Received",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Pizza || mongoose.model("Pizza", pizzaSchema);