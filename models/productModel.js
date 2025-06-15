const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'liter', 'pcs'], required: true },
  
});

module.exports = mongoose.model('Product', productSchema);
