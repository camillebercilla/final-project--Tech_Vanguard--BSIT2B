const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  price: Number,

  departureTime: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    enum: ["scheduled", "rescheduled", "cancelled"],
    default: "scheduled"
  }

}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);