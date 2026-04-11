const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

exports.bookSeat = async (req, res) => {
  const { tripId, seatNumber } = req.body;

  const trip = await Trip.findById(tripId);

  if (trip.availableSeats <= 0) {
    return res.status(400).send("No seats available");
  }

  trip.availableSeats -= 1;
  await trip.save();

  const booking = await Booking.create({
    userId: req.user.id,
    tripId,
    seatNumber
  });

  res.json(booking);
};