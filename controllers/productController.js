const Product = require('../models/productModel');

// Get all products for the logged-in user
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user }); // only user's products
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const { name, price, quantity, unit } = req.body;
  try {
    const newProduct = new Product({
      name,
      price,
      quantity,
      unit,
      userId: req.user, // associate with logged-in user
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { name, price, quantity, unit } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user }, // ensure the product belongs to the user
      { name, price, quantity, unit },
      { new: true }
    );

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findOneAndDelete({ _id: id, userId: req.user });

    if (!deleted) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
