// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Public routes (no auth)
router.get('/', getProducts);           // ✅ Get all products
router.post('/', addProduct);           // ✅ Add product (no ID in URL)
router.put('/:id', updateProduct);      // ✅ Update product by ID
router.delete('/:id', deleteProduct);   // ✅ Delete product by ID

module.exports = router;
