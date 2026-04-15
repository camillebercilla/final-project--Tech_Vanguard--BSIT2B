const Booking = require("../models/Booking");
const User = require("../models/User");

// Book seat
exports.createBooking = async (req, res) => {
  try {
    const { userId, tripId } = req.body;

    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      userId: user._id,
      tripId: tripId
    });

    res.status(201).json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tripId")
      .populate("userId");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ message: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bookings of a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ userId: user._id })
      .populate("tripId")
      .populate("userId");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 🔁 RESCHEDULE BOOKING (ADD THIS)
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { tripId, seatNumber } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        tripId,
        seatNumber,
        status: "rescheduled"
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};