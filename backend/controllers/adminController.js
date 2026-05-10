const Booking = require("../models/Booking");
const User    = require("../models/User");
const Trip    = require("../models/Trip");

/* ═══════════════════════════════════════════════════════════════
   TRIPS
   ═══════════════════════════════════════════════════════════════ */

exports.addTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   USERS
   ═══════════════════════════════════════════════════════════════ */

exports.getUsers = async (req, res) => {
  try {
    // Exclude password field from results
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Also delete all bookings that belong to this user
    await Booking.deleteMany({ userId: req.params.id });

    res.json({ message: "User and associated bookings deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   BOOKINGS
   ═══════════════════════════════════════════════════════════════ */

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")   // attach user details
      .sort({ createdAt: -1 })                  // newest first
      .lean();

    // Normalise shape so the frontend always gets passengerName, route, etc.
    // regardless of how the booking was originally saved.
    const normalised = bookings.map((b) => ({
      ...b,
      passengerName: b.passengerName || (b.userId && b.userId.name) || "—",
      route: b.route || (b.origin && b.destination
        ? `${b.origin} → ${b.destination}`
        : "—"),
    }));

    res.json(normalised);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};