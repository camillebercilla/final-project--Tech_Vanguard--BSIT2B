const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  departureTime: Date,
  price: Number,
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }
});

module.exports = mongoose.model("Trip", tripSchema);