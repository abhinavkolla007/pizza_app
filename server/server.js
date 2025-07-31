const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const pizzaRoutes = require("./routes/pizza");
const orderRoutes = require("./routes/order");
const pizzaRouter = require('./routes/pizza');
const inventoryRouter = require('./routes/inventory');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ All routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/order", orderRoutes); // ✅ Correct path
app.use('/api/pizza', pizzaRouter);
app.use('/api/inventory', inventoryRouter);

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
