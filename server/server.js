// require('dotenv').config(); // Load environment variables from .env
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path'); // For serving static files in production

// const authRoutes = require('./routes/auth');
// const inventoryRoutes = require('./routes/inventory');
// const pizzaRoutes = require('./routes/pizza');
// const paymentRoutes = require('./routes/payment');

// const app = express();

// // Middleware
// app.use(cors()); // Enable CORS for all origins (adjust in production)
// app.use(express.json()); // Body parser for JSON requests

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully!'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', inventoryRoutes); // Admin routes for inventory (includes admin orders)
// app.use('/api/pizza', pizzaRoutes); // User pizza orders and options
// app.use('/api/payment', paymentRoutes); // Payment gateway

// // Serve static files in production (if frontend is served from backend)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//   });
// }

// // Basic error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

//  const PORT = process.env.PORT || 5000;
//  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health check route
app.get('/api', (req, res) => {
  res.send({ message: 'API is running' });
});

// Export for Vercel
module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
