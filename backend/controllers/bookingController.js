const Booking = require("../models/Booking");
const User = require("../models/User");

// Create booking — now accepts full frontend payload
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      userName,
      route,
      seat,
      date,
      departure,
      price,
      status,
      paymentMethod,
      passengerName,
      passengerEmail,
      passengerPhone
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      userId:         user._id,
      userName:       userName       || user.name,
      route:          route          || "",
      seat:           seat           || "",
      date:           date           || "",
      departure:      departure      || "",
      price:          price          || 0,
      status:         status         || "confirmed",
      paymentMethod:  paymentMethod  || "Cash",
      passengerName:  passengerName  || user.name,
      passengerEmail: passengerEmail || user.email,
      passengerPhone: passengerPhone || user.phone || ""
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
      .populate("userId", "name email phone role");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single booking by its MongoDB _id  ← NEW
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone role");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    // Mongoose CastError = malformed ObjectId
    res.status(400).json({ message: "Invalid booking ID" });
  }
};

// Get bookings of a specific user by MongoDB _id
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate("userId", "name email phone role");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reschedule booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { route, seat, date, departure, price } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { route, seat, date, departure, price, status: "rescheduled" },
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