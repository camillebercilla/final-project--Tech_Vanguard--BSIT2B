const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({

  // Split route into two fields (matches your frontend origin/destination)
  origin:      { type: String, required: true },
  destination: { type: String, required: true },

  // Price range (matches your frontend priceMin/priceMax)
  priceMin:    { type: Number, default: 0 },
  priceMax:    { type: Number, default: 0 },

  // Multiple departure times (matches your frontend departures array)
  // e.g. ['06:00', '09:00', '12:00', '15:00', '18:00']
  departures:  [{ type: String }],

  // Trip duration string (matches your frontend duration)
  // e.g. '1-2 hrs', '30-45 mins'
  duration:    { type: String, default: '' },

  // Total seats on this route
  totalSeats:  { type: Number, default: 45 },

  status: {
    type: String,
    enum: ['scheduled', 'rescheduled', 'cancelled'],
    default: 'scheduled'
  }

}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);