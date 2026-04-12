const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  companyName: String,
  totalSeats: Number,
  busType: String
});

module.exports = mongoose.model("Bus", busSchema);