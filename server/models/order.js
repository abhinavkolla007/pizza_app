const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);