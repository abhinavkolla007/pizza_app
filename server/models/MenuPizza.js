const mongoose = require("mongoose");

const menuPizzaSchema = new mongoose.Schema({
  name: String,
  base: String,
  sauce: String,
  cheese: String,
  price: Number,
});

module.exports = mongoose.model("MenuPizza", menuPizzaSchema);