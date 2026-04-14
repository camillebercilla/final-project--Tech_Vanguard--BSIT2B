const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);