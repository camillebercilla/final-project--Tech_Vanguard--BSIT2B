const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  seatNumber: Number,
  status: { type: String, default: "booked" },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);