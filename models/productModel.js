const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the drug's name"],
    unique: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  dosage: {
    type: Number,
    required: [true, 'Please provide a dosage'],
  },
  frequency: {
    type: String,
  },
  unit: {
    type: String,
    enum: ['mg', 'g', 'ml', 'l'],
    default: 'mg',
    required: [true, 'Please provide a unit'],
  },
  stockCount: {
    type: Number,
    required: [true, 'Please provide the stock count for this product'],
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date'],
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
