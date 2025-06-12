// app.js
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth'); // ✅ Add this line
const adminAuthRoutes = require('./routes/adminAuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Mount all routes
app.use('/products', productRoutes);
app.use('/api/auth', authRoutes); // ✅ Add this line
app.use('/api/admin', adminAuthRoutes);

module.exports = app;
