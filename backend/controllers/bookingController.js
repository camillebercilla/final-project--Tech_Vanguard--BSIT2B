const Booking = require("../models/Booking");

// Book seat
exports.createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};

// View bookings
exports.getBookings = async (req, res) => {
  const bookings = await Booking.find().populate("tripId");
  res.json(bookings);
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
  res.json("Booking cancelled");
};