// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware

// Public (optional: make this protected too if needed)
router.get('/', getProducts);

// Protected routes
router.post('/',  addProduct);            // ✅ Add Product (auth required)
router.put('/:id',  updateProduct);       // ✅ Update Product (auth required)
router.delete('/:id',  deleteProduct);    // ✅ Delete Product (auth required)

module.exports = router;
